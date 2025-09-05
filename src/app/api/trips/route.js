import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken, getTokenFromAuthHeader } from '@/lib/jwt';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromAuthHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { trips } = await connectToDatabase();

    // Fetch user's trips, sorted by start date (newest first)
    const userTrips = await trips
      .find({ userId: new ObjectId(decoded.id) })
      .sort({ startDate: -1 })
      .toArray();

    return NextResponse.json({
      trips: userTrips
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch trips error:', error);
    
    // Handle specific MongoDB connection errors
    if (error.message.includes('EREFUSED') || error.message.includes('queryTxt')) {
      return NextResponse.json(
        { error: 'Database temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromAuthHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const tripData = await request.json();
    const {
      destination,
      startDate,
      endDate,
      purpose,
      transportation,
      accommodation,
      companions,
      activities,
      notes
    } = tripData;

    // Validate required fields
    if (!destination || !startDate || !endDate || !purpose || !transportation) {
      return NextResponse.json(
        { error: 'Destination, start date, end date, purpose, and transportation are required' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (end < start) {
      return NextResponse.json(
        { error: 'End date cannot be before start date' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const tripsCollection = db.collection(collections.trips);

    // Create trip document
    const newTrip = {
      userId: new ObjectId(decoded.id),
      destination: destination.trim(),
      startDate: start,
      endDate: end,
      purpose,
      transportation,
      accommodation: accommodation || null,
      companions: companions?.trim() || null,
      activities: activities?.trim() || null,
      notes: notes?.trim() || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await tripsCollection.insertOne(newTrip);

    return NextResponse.json({
      message: 'Trip added successfully',
      tripId: result.insertedId
    }, { status: 201 });

  } catch (error) {
    console.error('Add trip error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
