import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { createToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const { users } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      email,
      password: hashedPassword,
      name,
      consent: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await users.insertOne(newUser);

    // Create JWT token
    const userForToken = {
      id: result.insertedId,
      email,
      name,
      consent: null
    };

    const token = createToken(userForToken);

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: userForToken
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
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
