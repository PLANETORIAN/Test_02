// Amadeus API utility functions
const AMADEUS_BASE_URL = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';
const API_KEY = process.env.AMADEUS_API_KEY;
const API_SECRET = process.env.AMADEUS_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.warn('Amadeus API credentials not found in environment variables');
}

let accessToken = null;
let tokenExpiry = null;

// Get access token from Amadeus API
async function getAccessToken() {
  if (!API_KEY || !API_SECRET) {
    console.warn('Amadeus API credentials not configured, using fallback data');
    throw new Error('Amadeus API credentials not configured');
  }

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
      const errorText = await response.text();
      console.warn('Amadeus token error:', response.status, errorText);
      console.warn('Using fallback data instead of Amadeus API');
      throw new Error(`Amadeus API authentication failed: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

    console.log('✅ Successfully authenticated with Amadeus API');
    return accessToken;
  } catch (error) {
    console.warn('Amadeus authentication failed, falling back to mock data:', error.message);
    throw error;
  }
}

// Fallback destination data
const fallbackDestinations = [
  {
    id: 'PAR',
    name: 'Paris',
    iataCode: 'CDG',
    address: { countryCode: 'FR', countryName: 'France', cityName: 'Paris' },
    subType: 'CITY',
    detailedName: 'Paris, France'
  },
  {
    id: 'LON',
    name: 'London',
    iataCode: 'LHR',
    address: { countryCode: 'GB', countryName: 'United Kingdom', cityName: 'London' },
    subType: 'CITY',
    detailedName: 'London, United Kingdom'
  },
  {
    id: 'NYC',
    name: 'New York',
    iataCode: 'JFK',
    address: { countryCode: 'US', countryName: 'United States', cityName: 'New York' },
    subType: 'CITY',
    detailedName: 'New York, United States'
  },
  {
    id: 'TYO',
    name: 'Tokyo',
    iataCode: 'NRT',
    address: { countryCode: 'JP', countryName: 'Japan', cityName: 'Tokyo' },
    subType: 'CITY',
    detailedName: 'Tokyo, Japan'
  },
  {
    id: 'DXB',
    name: 'Dubai',
    iataCode: 'DXB',
    address: { countryCode: 'AE', countryName: 'United Arab Emirates', cityName: 'Dubai' },
    subType: 'CITY',
    detailedName: 'Dubai, United Arab Emirates'
  },
  {
    id: 'SIN',
    name: 'Singapore',
    iataCode: 'SIN',
    address: { countryCode: 'SG', countryName: 'Singapore', cityName: 'Singapore' },
    subType: 'CITY',
    detailedName: 'Singapore'
  },
  {
    id: 'DEL',
    name: 'New Delhi',
    iataCode: 'DEL',
    address: { countryCode: 'IN', countryName: 'India', cityName: 'New Delhi' },
    subType: 'CITY',
    detailedName: 'New Delhi, India'
  },
  {
    id: 'BOM',
    name: 'Mumbai',
    iataCode: 'BOM',
    address: { countryCode: 'IN', countryName: 'India', cityName: 'Mumbai' },
    subType: 'CITY',
    detailedName: 'Mumbai, India'
  }
];

// Search for popular destinations
export async function searchDestinations(keyword = '', limit = 20) {
  try {
    if (!API_KEY || !API_SECRET) {
      console.warn('Using fallback destinations - Amadeus API not configured');
      return fallbackDestinations.filter(dest => 
        !keyword || dest.name.toLowerCase().includes(keyword.toLowerCase()) ||
        dest.detailedName.toLowerCase().includes(keyword.toLowerCase())
      ).slice(0, limit);
    }

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
    console.warn('Falling back to local destination data');
    return fallbackDestinations.filter(dest => 
      !keyword || dest.name.toLowerCase().includes(keyword.toLowerCase()) ||
      dest.detailedName.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, limit);
  }
}

// Get popular destinations (predefined list + API search)
export async function getPopularDestinations() {
  try {
    if (!API_KEY || !API_SECRET) {
      console.warn('Using fallback destinations - Amadeus API not configured');
      return fallbackDestinations;
    }

    const popularCities = ['Paris', 'London', 'New York', 'Tokyo', 'Dubai', 'Singapore'];
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
        // Add fallback data for this city
        const fallback = fallbackDestinations.find(dest => 
          dest.name.toLowerCase() === city.toLowerCase()
        );
        if (fallback) {
          destinations.push(fallback);
        }
      }
    }

    return destinations.length > 0 ? destinations : fallbackDestinations;
  } catch (error) {
    console.error('Error getting popular destinations:', error);
    return fallbackDestinations;
  }
}

// Search for airports near a location
export async function searchAirports(keyword, limit = 10) {
  try {
    if (!API_KEY || !API_SECRET) {
      console.warn('Using fallback airports - Amadeus API not configured');
      return fallbackDestinations.filter(dest => 
        dest.subType === 'AIRPORT' || dest.iataCode
      ).slice(0, limit);
    }

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
    return fallbackDestinations.filter(dest => 
      dest.iataCode && (
        dest.name.toLowerCase().includes(keyword.toLowerCase()) ||
        dest.iataCode.toLowerCase().includes(keyword.toLowerCase())
      )
    ).slice(0, limit);
  }
}

// Flight search function
export async function searchFlights(origin, destination, departureDate, returnDate = null) {
  try {
    if (!API_KEY || !API_SECRET) {
      console.warn('Using mock flight data - Amadeus API not configured');
      return getMockFlights(origin, destination, departureDate);
    }

    const token = await getAccessToken();
    
    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: '1',
      max: '10'
    });

    if (returnDate) {
      params.append('returnDate', returnDate);
    }

    const response = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Flight search failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching flights:', error);
    return getMockFlights(origin, destination, departureDate);
  }
}

// Hotel search function
export async function searchHotels(cityCode, checkInDate, checkOutDate, adults = 1, radius = 50, radiusUnit = 'KM') {
  try {
    if (!API_KEY || !API_SECRET) {
      console.warn('Using mock hotel data - Amadeus API not configured');
      return getMockHotels(cityCode);
    }

    const token = await getAccessToken();
    
    const params = new URLSearchParams({
      cityCode: cityCode,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      adults: adults.toString(),
      radius: radius.toString(),
      radiusUnit: radiusUnit,
      ratings: '4,5',
      amenities: 'SWIMMING_POOL,SPA,FITNESS_CENTER,PARKING',
      sort: 'PRICE'
    });

    const response = await fetch(`${AMADEUS_BASE_URL}/v3/shopping/hotel-offers?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Hotel search failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching hotels:', error);
    return getMockHotels(cityCode);
  }
}

// Points of Interest search
export async function searchPointsOfInterest(latitude, longitude, radius = 1) {
  try {
    if (!API_KEY || !API_SECRET) {
      console.warn('Using mock POI data - Amadeus API not configured');
      return getMockPOI();
    }

    const token = await getAccessToken();
    
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
      'page[limit]': '20',
      categories: 'SIGHTS,BEACH_PARK,HISTORICAL,MUSEUMS,NIGHTLIFE,RESTAURANT,SHOPPING'
    });

    const response = await fetch(`${AMADEUS_BASE_URL}/v1/reference-data/locations/pois?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`POI search failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching POI:', error);
    return getMockPOI();
  }
}

// Airline routes search
export async function getAirlineRoutes(originCode, maxFlightOffers = 10) {
  try {
    if (!API_KEY || !API_SECRET) {
      console.warn('Using mock airline routes - Amadeus API not configured');
      return getMockAirlineRoutes(originCode);
    }

    const token = await getAccessToken();
    
    const params = new URLSearchParams({
      originCityCode: originCode,
      maxFlightOffers: maxFlightOffers.toString()
    });

    const response = await fetch(`${AMADEUS_BASE_URL}/v1/shopping/flight-destinations?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Airline routes search failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching airline routes:', error);
    return getMockAirlineRoutes(originCode);
  }
}

// Generate travel recommendations for a destination
export async function generateTravelRecommendations(destination, travelDates, travelers = 1) {
  try {
    const { startDate, endDate } = travelDates;
    const destinationInfo = await searchDestinations(destination.name, 1);
    
    if (destinationInfo.length === 0) {
      throw new Error('Destination not found');
    }

    const dest = destinationInfo[0];
    const recommendations = {
      destination: dest,
      flights: [],
      hotels: [],
      activities: [],
      restaurants: [],
      estimatedBudget: {
        flights: 0,
        hotels: 0,
        activities: 0,
        food: 0,
        total: 0
      }
    };

    // Get nearby airports for flight recommendations
    if (dest.geoCode) {
      const nearbyAirports = await searchAirports(dest.name, 3);
      if (nearbyAirports.length > 0) {
        const airportCode = nearbyAirports[0].iataCode;
        
        // Search for flights (mock for now)
        recommendations.flights = await searchFlights('DEL', airportCode, startDate, endDate);
      }
    }

    // Search for hotels
    if (dest.address?.cityName) {
      const cityCode = dest.iataCode || dest.address.cityName.substring(0, 3).toUpperCase();
      recommendations.hotels = await searchHotels(cityCode, startDate, endDate, travelers);
    }

    // Search for points of interest
    if (dest.geoCode) {
      recommendations.activities = await searchPointsOfInterest(
        dest.geoCode.latitude, 
        dest.geoCode.longitude
      );
    }

    // Calculate estimated budget
    if (recommendations.flights.length > 0) {
      recommendations.estimatedBudget.flights = Math.min(...recommendations.flights.map(f => parseFloat(f.price?.total || 0)));
    }

    if (recommendations.hotels.length > 0) {
      const nightlyRate = Math.min(...recommendations.hotels.map(h => 
        parseFloat(h.offers?.[0]?.price?.total || 100)
      ));
      const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      recommendations.estimatedBudget.hotels = nightlyRate * nights;
    }

    recommendations.estimatedBudget.activities = recommendations.activities.length * 50; // $50 per activity
    recommendations.estimatedBudget.food = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) * 80; // $80 per day
    recommendations.estimatedBudget.total = 
      recommendations.estimatedBudget.flights + 
      recommendations.estimatedBudget.hotels + 
      recommendations.estimatedBudget.activities + 
      recommendations.estimatedBudget.food;

    return recommendations;
  } catch (error) {
    console.error('Error generating travel recommendations:', error);
    return getMockRecommendations(destination, travelDates);
  }
}

// Mock data functions for fallback
function getMockFlights(origin, destination, departureDate) {
  return [
    {
      id: '1',
      source: 'GDS',
      price: { currency: 'USD', total: '299.00', base: '250.00' },
      itineraries: [{
        duration: 'PT2H30M',
        segments: [{
          departure: { iataCode: origin, at: `${departureDate}T08:30:00` },
          arrival: { iataCode: destination, at: `${departureDate}T11:00:00` },
          carrierCode: 'AI',
          number: '131',
          duration: 'PT2H30M'
        }]
      }]
    },
    {
      id: '2',
      source: 'GDS',
      price: { currency: 'USD', total: '399.00', base: '350.00' },
      itineraries: [{
        duration: 'PT1H45M',
        segments: [{
          departure: { iataCode: origin, at: `${departureDate}T14:20:00` },
          arrival: { iataCode: destination, at: `${departureDate}T16:05:00` },
          carrierCode: 'SG',
          number: '242',
          duration: 'PT1H45M'
        }]
      }]
    }
  ];
}

function getMockHotels(cityCode) {
  return [
    {
      type: 'hotel',
      hotel: {
        type: 'hotel',
        hotelId: 'MCLONGHM',
        chainCode: 'MC',
        dupeId: '700027441',
        name: 'Grand Palace Hotel',
        rating: '5',
        description: { text: 'Luxury hotel in the heart of the city' },
        amenities: ['SWIMMING_POOL', 'SPA', 'FITNESS_CENTER', 'RESTAURANT', 'BAR', 'PARKING']
      },
      offers: [{
        id: 'offer1',
        price: { currency: 'USD', total: '189.00', base: '170.00' },
        policies: { cancellation: { type: 'FULL_STAY' } },
        room: { type: 'A1K', typeEstimated: { category: 'SUPERIOR_ROOM' } }
      }]
    },
    {
      type: 'hotel',
      hotel: {
        type: 'hotel',
        hotelId: 'OCLONRES',
        chainCode: 'OC',
        name: 'Ocean View Resort',
        rating: '4',
        description: { text: 'Beautiful resort with ocean views' },
        amenities: ['BEACH', 'SWIMMING_POOL', 'RESTAURANT', 'BAR', 'PARKING']
      },
      offers: [{
        id: 'offer2',
        price: { currency: 'USD', total: '129.00', base: '110.00' },
        policies: { cancellation: { type: 'FULL_STAY' } },
        room: { type: 'A1Q', typeEstimated: { category: 'STANDARD_ROOM' } }
      }]
    }
  ];
}

function getMockPOI() {
  return [
    {
      type: 'location',
      subType: 'POINT_OF_INTEREST',
      id: '12345',
      name: 'Historic City Center',
      category: 'SIGHTS',
      rank: '1',
      tags: ['historic', 'architecture', 'cultural'],
      geoCode: { latitude: 40.7128, longitude: -74.0060 }
    },
    {
      type: 'location',
      subType: 'POINT_OF_INTEREST',
      id: '12346',
      name: 'Central Park',
      category: 'BEACH_PARK',
      rank: '2',
      tags: ['nature', 'park', 'recreational'],
      geoCode: { latitude: 40.7829, longitude: -73.9654 }
    },
    {
      type: 'location',
      subType: 'POINT_OF_INTEREST',
      id: '12347',
      name: 'Art Museum',
      category: 'MUSEUMS',
      rank: '3',
      tags: ['art', 'culture', 'educational'],
      geoCode: { latitude: 40.7794, longitude: -73.9632 }
    }
  ];
}

function getMockAirlineRoutes(originCode) {
  return [
    {
      type: 'flight-destination',
      origin: originCode,
      destination: 'NYC',
      departureDate: '2025-09-10',
      price: { total: '299.00' },
      links: { flightDates: 'flight-dates-url', flightOffers: 'flight-offers-url' }
    },
    {
      type: 'flight-destination',
      origin: originCode,
      destination: 'LON',
      departureDate: '2025-09-10',
      price: { total: '599.00' },
      links: { flightDates: 'flight-dates-url', flightOffers: 'flight-offers-url' }
    }
  ];
}

function getMockRecommendations(destination, travelDates) {
  return {
    destination: {
      id: 'MOCK',
      name: destination.name || 'Paris',
      detailedName: `${destination.name || 'Paris'}, France`,
      address: { countryCode: 'FR', countryName: 'France' }
    },
    flights: getMockFlights('DEL', 'CDG', travelDates.startDate),
    hotels: getMockHotels('PAR'),
    activities: getMockPOI(),
    restaurants: [],
    estimatedBudget: {
      flights: 299,
      hotels: 189,
      activities: 150,
      food: 240,
      total: 878
    }
  };
}
