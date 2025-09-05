import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken, getTokenFromAuthHeader } from '@/lib/jwt';

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

    const { consent } = await request.json();

    if (typeof consent !== 'boolean') {
      return NextResponse.json(
        { error: 'Consent must be a boolean value' },
        { status: 400 }
      );
    }

    const { users } = await connectToDatabase();

    // Update user consent
    const result = await users.updateOne(
      { _id: new ObjectId(decoded.id) },
      { 
        $set: { 
          consent,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Consent updated successfully',
      consent
    }, { status: 200 });

  } catch (error) {
    console.error('Consent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
