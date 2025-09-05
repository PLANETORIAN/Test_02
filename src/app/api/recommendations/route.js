import { NextResponse } from 'next/server';
import { generateTravelRecommendations, searchDestinations } from '@/lib/amadeus';

export async function POST(request) {
  try {
    const body = await request.json();
    const { destination, startDate, endDate, travelers = 1, preferences = {} } = body;

    // Validate required fields
    if (!destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Destination, start date, and end date are required' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    if (start < today) {
      return NextResponse.json(
        { error: 'Start date cannot be in the past' },
        { status: 400 }
      );
    }

    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Generate travel recommendations
    const recommendations = await generateTravelRecommendations(
      destination,
      { startDate, endDate },
      travelers
    );

    // Add travel preferences to recommendations
    if (preferences.budget) {
      recommendations.budgetPreference = preferences.budget;
      // Filter recommendations based on budget
      if (preferences.budget === 'budget') {
        recommendations.hotels = recommendations.hotels.filter(hotel => 
          parseFloat(hotel.offers?.[0]?.price?.total || 0) < 150
        );
      } else if (preferences.budget === 'luxury') {
        recommendations.hotels = recommendations.hotels.filter(hotel => 
          parseFloat(hotel.offers?.[0]?.price?.total || 0) > 200
        );
      }
    }

    if (preferences.travelStyle) {
      recommendations.travelStyle = preferences.travelStyle;
      // Filter activities based on travel style
      if (preferences.travelStyle === 'adventure') {
        recommendations.activities = recommendations.activities.filter(activity =>
          activity.tags?.includes('adventure') || activity.category === 'OUTDOOR'
        );
      } else if (preferences.travelStyle === 'cultural') {
        recommendations.activities = recommendations.activities.filter(activity =>
          activity.category === 'MUSEUMS' || activity.category === 'HISTORICAL' || 
          activity.tags?.includes('cultural')
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
      generatedAt: new Date().toISOString(),
      tripDuration: Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
      travelers: travelers
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating travel recommendations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate travel recommendations', 
        message: error.message,
        fallback: true
      },
      { status: 500 }
    );
  }
}

// GET endpoint for popular destination recommendations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    
    // Get popular destinations
    const popularDestinations = [
      'Paris', 'London', 'New York', 'Tokyo', 'Dubai', 'Singapore',
      'Barcelona', 'Rome', 'Amsterdam', 'Bangkok'
    ].slice(0, limit);

    const recommendations = [];
    
    for (const cityName of popularDestinations) {
      try {
        const destinations = await searchDestinations(cityName, 1);
        if (destinations.length > 0) {
          const dest = destinations[0];
          recommendations.push({
            destination: dest,
            popularityScore: Math.floor(Math.random() * 100) + 1,
            averageBudget: Math.floor(Math.random() * 1000) + 500,
            bestTimeToVisit: ['Spring', 'Summer', 'Fall', 'Winter'][Math.floor(Math.random() * 4)],
            highlights: getDestinationHighlights(cityName)
          });
        }
      } catch (error) {
        console.warn(`Failed to get data for ${cityName}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
      total: recommendations.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching popular recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

function getDestinationHighlights(cityName) {
  const highlights = {
    'Paris': ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Seine River Cruise'],
    'London': ['Big Ben', 'London Eye', 'British Museum', 'Tower Bridge'],
    'New York': ['Statue of Liberty', 'Central Park', 'Empire State Building', 'Broadway Shows'],
    'Tokyo': ['Mount Fuji', 'Sensoji Temple', 'Tokyo Skytree', 'Shibuya Crossing'],
    'Dubai': ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Dubai Fountain'],
    'Singapore': ['Marina Bay Sands', 'Gardens by the Bay', 'Singapore Zoo', 'Sentosa Island'],
    'Barcelona': ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Gothic Quarter'],
    'Rome': ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
    'Amsterdam': ['Anne Frank House', 'Van Gogh Museum', 'Canal Cruise', 'Rijksmuseum'],
    'Bangkok': ['Grand Palace', 'Wat Pho Temple', 'Floating Markets', 'Chatuchak Market']
  };
  
  return highlights[cityName] || ['Historic Sites', 'Local Culture', 'Great Food', 'Beautiful Views'];
}
