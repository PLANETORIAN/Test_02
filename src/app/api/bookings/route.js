import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import { ObjectId } from 'mongodb';
import { ObjectId } from 'mongodb';

// GET /api/bookings - Fetch user's bookings
export async function GET(request) {
  try {
    // Get token from Authorization header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify token and get user
    const decoded = verifyToken(token);
    const userId = decoded.userId;

    // Connect to database
    const { bookings } = await connectToDatabase();

    // Find user's bookings
    const userBookings = await bookings.find({ userId }).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(userBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request) {
  try {
    // Get token from Authorization header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify token and get user
    const decoded = verifyToken(token);
    const userId = decoded.userId;

    // Parse request body
    const body = await request.json();
    const {
      items,
      itinerary,
      paymentDetails,
      totalAmount,
      bookingType = 'complete'
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Booking items are required' }, { status: 400 });
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ error: 'Valid total amount is required' }, { status: 400 });
    }

    // Connect to database
    const { bookings } = await connectToDatabase();

    // Create booking document
    const booking = {
      userId,
      items,
      itinerary: itinerary || null,
      totalAmount,
      bookingType,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentDetails: {
        method: paymentDetails?.method || 'card',
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paidAt: new Date()
      },
      bookingReference: `BOOK_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert booking
    const result = await bookings.insertOne(booking);

    if (!result.acknowledged) {
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    // Return created booking
    const createdBooking = await bookings.findOne({ _id: result.insertedId });
    
    return NextResponse.json(createdBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// PUT /api/bookings - Update a booking
export async function PUT(request) {
  try {
    // Get token from Authorization header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify token and get user
    const decoded = verifyToken(token);
    const userId = decoded.userId;

    // Parse request body
    const body = await request.json();
    const { bookingId, status, ...updateData } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    // Connect to database
    const { bookings } = await connectToDatabase();

    // Update booking
    const result = await bookings.updateOne(
      { _id: new ObjectId(bookingId), userId },
      { 
        $set: { 
          ...updateData,
          status: status || updateData.status,
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Return updated booking
    const updatedBooking = await bookings.findOne({ _id: new ObjectId(bookingId) });
    
    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
