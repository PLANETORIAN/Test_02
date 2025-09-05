// Amadeus API utility functions
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

// Search for popular destinations
export async function searchDestinations(keyword = '', limit = 20) {
  try {
    const token = await getAccessToken();
    
    const params = new URLSearchParams({
      subType: 'CITY,AIRPORT',
      'page[limit]': limit.toString(),
    });
    
    if (keyword) {
      params.append('keyword', keyword);
    }

    const response = await fetch(`${AMADEUS_BASE_URL}/v1/reference-data/locations?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching destinations:', error);
    throw error;
  }
}

// Get popular destinations (predefined list + API search)
export async function getPopularDestinations() {
  const popularCities = [
    'Paris', 'London', 'New York', 'Tokyo', 'Dubai', 'Singapore', 
    'Barcelona', 'Rome', 'Amsterdam', 'Bangkok', 'Sydney', 'Los Angeles',
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'
  ];

  try {
    const destinations = [];
    
    // Search for each popular city
    for (const city of popularCities) {
      try {
        const results = await searchDestinations(city, 1);
        if (results.length > 0) {
          destinations.push(results[0]);
        }
      } catch (error) {
        console.warn(`Failed to fetch data for ${city}:`, error);
      }
    }

    return destinations;
  } catch (error) {
    console.error('Error getting popular destinations:', error);
    return [];
  }
}

// Search for airports near a location
export async function searchAirports(keyword, limit = 10) {
  try {
    const token = await getAccessToken();
    
    const params = new URLSearchParams({
      subType: 'AIRPORT',
      keyword: keyword,
      'page[limit]': limit.toString(),
    });

    const response = await fetch(`${AMADEUS_BASE_URL}/v1/reference-data/locations?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching airports:', error);
    throw error;
  }
}
