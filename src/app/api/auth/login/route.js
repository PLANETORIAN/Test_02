import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { createToken } from '@/lib/jwt';
import { shouldUseFallbackMode, FallbackDatabase } from '@/lib/fallback-data';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      const { users } = await connectToDatabase();

      // Find user by email
      const user = await users.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Create JWT token
      const userForToken = {
        id: user._id,
        email: user.email,
        name: user.name,
        consent: user.consent
      };

      const token = createToken(userForToken);

      return NextResponse.json({
        message: 'Login successful',
        token,
        user: userForToken
      }, { status: 200 });

    } catch (dbError) {
      // Check if we should use fallback mode
      if (shouldUseFallbackMode(dbError)) {
        console.warn('Database unavailable, using fallback authentication');
        
        // Use fallback data for demo purposes
        const user = await FallbackDatabase.findUser(email);
        
        if (!user || password !== 'password123') { // Demo password for fallback
          return NextResponse.json(
            { error: 'Invalid credentials (demo mode: use password123)' },
            { status: 401 }
          );
        }

        // Create JWT token
        const userForToken = {
          id: user.id,
          email: user.email,
          name: user.name,
          consent: user.consentGiven
        };

        const token = createToken(userForToken);

        return NextResponse.json({
          message: 'Login successful (demo mode)',
          token,
          user: userForToken,
          fallbackMode: true
        }, { status: 200 });
      }
      
      throw dbError; // Re-throw if not a connection error
    }

  } catch (error) {
    console.error('Login error:', error);
    
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
