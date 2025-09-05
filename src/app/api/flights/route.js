import { NextResponse } from 'next/server';
import { searchFlights } from '@/lib/amadeus';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const adults = searchParams.get('adults') || '1';

    // Validate required parameters
    if (!origin || !destination || !departureDate) {
      return NextResponse.json(
        { error: 'Origin, destination, and departure date are required' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(departureDate)) {
      return NextResponse.json(
        { error: 'Invalid departure date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (returnDate && !dateRegex.test(returnDate)) {
      return NextResponse.json(
        { error: 'Invalid return date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    try {
      const flights = await searchFlights(origin, destination, departureDate, returnDate);
      
      return NextResponse.json({
        flights,
        searchParams: {
          origin,
          destination,
          departureDate,
          returnDate,
          adults
        },
        meta: {
          count: flights.length
        }
      }, { status: 200 });

    } catch (flightError) {
      console.error('Flight search error:', flightError);
      
      // Return mock flight data as fallback
      const mockFlights = [
        {
          id: 'mock-1',
          airline: 'Air Global',
          from: origin,
          to: destination,
          departTime: '08:30',
          arriveTime: '10:45',
          duration: '2h 15m',
          price: 299,
          class: 'Economy',
          stops: 'Non-stop',
          date: departureDate
        },
        {
          id: 'mock-2',
          airline: 'SkyWings',
          from: origin,
          to: destination,
          departTime: '14:20',
          arriveTime: '16:50',
          duration: '2h 30m',
          price: 349,
          class: 'Economy',
          stops: 'Non-stop',
          date: departureDate
        }
      ];

      return NextResponse.json({
        flights: mockFlights,
        searchParams: {
          origin,
          destination,
          departureDate,
          returnDate,
          adults
        },
        meta: {
          count: mockFlights.length
        },
        fallback: true,
        message: 'Using sample flight data'
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Flight API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
