import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase, collections } from '@/lib/mongodb';
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

    const { db } = await connectToDatabase();
    const usersCollection = db.collection(collections.users);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
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

    const result = await usersCollection.insertOne(newUser);

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
