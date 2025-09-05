import { NextResponse } from 'next/server';
import { testConnection, initializeDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Test connection
    const connectionTest = await testConnection();
    if (!connectionTest) {
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to MongoDB'
      }, { status: 500 });
    }

    // Initialize database
    const initTest = await initializeDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      connection: connectionTest,
      initialization: initTest,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('MongoDB test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
