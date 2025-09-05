// Fallback data for when external services are unavailable

export const fallbackUsers = [
  {
    id: 'demo-user-1',
    email: 'demo@example.com',
    name: 'Demo User',
    password: '$2a$10$dummy.hash.for.demo.user.password', // This would be "password123" hashed
    consentGiven: true,
    createdAt: new Date('2025-01-01'),
  }
];

export const fallbackTrips = [
  {
    id: 'demo-trip-1',
    userId: 'demo-user-1',
    destination: 'Paris, France',
    startDate: '2025-10-15',
    endDate: '2025-10-22',
    purpose: 'leisure',
    transportation: 'flight',
    accommodation: 'hotel',
    budget: 2000,
    notes: 'Demo trip to Paris for vacation',
    createdAt: new Date('2025-09-01'),
  },
  {
    id: 'demo-trip-2',
    userId: 'demo-user-1',
    destination: 'Tokyo, Japan',
    startDate: '2025-12-01',
    endDate: '2025-12-10',
    purpose: 'business',
    transportation: 'flight',
    accommodation: 'hotel',
    budget: 3500,
    notes: 'Business trip to Tokyo',
    createdAt: new Date('2025-09-02'),
  }
];

export const fallbackBookings = [
  {
    id: 'demo-booking-1',
    userId: 'demo-user-1',
    type: 'flight',
    bookingReference: 'FL123456',
    details: {
      airline: 'Air Global',
      from: 'DEL',
      to: 'CDG',
      departTime: '08:30',
      arriveTime: '14:45',
      date: '2025-10-15',
      price: 599
    },
    status: 'confirmed',
    createdAt: new Date('2025-09-01'),
  },
  {
    id: 'demo-booking-2',
    userId: 'demo-user-1',
    type: 'hotel',
    bookingReference: 'HT789012',
    details: {
      name: 'Grand Palace Hotel Paris',
      location: 'Paris, France',
      checkIn: '2025-10-15',
      checkOut: '2025-10-22',
      rooms: 1,
      guests: 2,
      price: 1400
    },
    status: 'confirmed',
    createdAt: new Date('2025-09-01'),
  }
];

// Check if we should use fallback mode
export function shouldUseFallbackMode(error) {
  if (!error) return false;
  
  const errorMessage = error.message || error.toString();
  return (
    errorMessage.includes('EREFUSED') ||
    errorMessage.includes('queryTxt') ||
    errorMessage.includes('ENOTFOUND') ||
    errorMessage.includes('ETIMEDOUT') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('network')
  );
}

// Simulate database operations for fallback mode
export class FallbackDatabase {
  static users = [...fallbackUsers];
  static trips = [...fallbackTrips];
  static bookings = [...fallbackBookings];

  static async findUser(email) {
    return this.users.find(user => user.email === email) || null;
  }

  static async createUser(userData) {
    const newUser = {
      id: `demo-user-${Date.now()}`,
      ...userData,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  static async getUserTrips(userId) {
    return this.trips.filter(trip => trip.userId === userId);
  }

  static async createTrip(tripData) {
    const newTrip = {
      id: `demo-trip-${Date.now()}`,
      ...tripData,
      createdAt: new Date(),
    };
    this.trips.push(newTrip);
    return newTrip;
  }

  static async getUserBookings(userId) {
    return this.bookings.filter(booking => booking.userId === userId);
  }

  static async createBooking(bookingData) {
    const newBooking = {
      id: `demo-booking-${Date.now()}`,
      bookingReference: `REF${Date.now()}`,
      ...bookingData,
      createdAt: new Date(),
    };
    this.bookings.push(newBooking);
    return newBooking;
  }
}
