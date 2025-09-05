import { NextResponse } from 'next/server';

const AMADEUS_BASE_URL = 'https://test.api.amadeus.com';
const API_KEY = 'uNDDAsA9TTnfaOA6AIPKv6PmuhDofGh0';
const API_SECRET = 'GFRUZPDGQqOmA9uV';

let accessToken = null;
let tokenExpiry = null;

// Get access token from Amadeus API
async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: API_KEY,
        client_secret: API_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const limit = searchParams.get('limit') || '20';

    if (!keyword || keyword.length < 2) {
      return NextResponse.json(
        { error: 'Keyword must be at least 2 characters long' },
        { status: 400 }
      );
    }

    const token = await getAccessToken();
    
    const params = new URLSearchParams({
      subType: 'CITY,AIRPORT',
      keyword: keyword,
      'page[limit]': limit,
    });

    const response = await fetch(`${AMADEUS_BASE_URL}/v1/reference-data/locations?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Amadeus API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to search destinations', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Format the response to match our expected structure
    const destinations = (data.data || []).map(location => ({
      id: location.id,
      name: location.name,
      iataCode: location.iataCode,
      address: {
        countryCode: location.address?.countryCode,
        countryName: location.address?.countryName,
        stateCode: location.address?.stateCode,
        cityName: location.address?.cityName,
      },
      geoCode: location.geoCode,
      subType: location.subType,
      detailedName: location.detailedName,
      timeZoneOffset: location.timeZoneOffset,
    }));

    return NextResponse.json({
      destinations,
      meta: data.meta,
    }, { status: 200 });

  } catch (error) {
    console.error('Destination search error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
