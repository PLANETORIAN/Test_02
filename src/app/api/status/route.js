import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/mongodb';

export async function GET() {
  const status = {
    timestamp: new Date().toISOString(),
    services: {
      app: 'healthy',
      database: 'checking',
      amadeus: 'checking'
    },
    fallbackMode: false
  };

  // Test MongoDB connection
  try {
    const mongoConnected = await testConnection();
    status.services.database = mongoConnected ? 'healthy' : 'unavailable';
  } catch (error) {
    status.services.database = 'unavailable';
    status.fallbackMode = true;
  }

  // Test Amadeus API (simple check)
  try {
    const amadeusKey = process.env.AMADEUS_API_KEY;
    const amadeusSecret = process.env.AMADEUS_API_SECRET;
    
    if (!amadeusKey || !amadeusSecret) {
      status.services.amadeus = 'not_configured';
    } else {
      // Could add actual API test here, but for now just check if credentials exist
      status.services.amadeus = 'configured';
    }
  } catch (error) {
    status.services.amadeus = 'unavailable';
  }

  // Determine overall health
  const allServicesHealthy = Object.values(status.services).every(service => 
    service === 'healthy' || service === 'configured'
  );

  return NextResponse.json({
    ...status,
    overall: allServicesHealthy ? 'healthy' : 'degraded',
    message: status.fallbackMode ? 
      'Running in fallback mode due to external service issues' :
      'All services operational'
  }, { 
    status: allServicesHealthy ? 200 : 503 
  });
}
