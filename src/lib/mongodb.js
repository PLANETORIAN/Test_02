import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

if (!uri) {
  console.error('MongoDB URI is not defined in environment variables');
  throw new Error('Please add your MongoDB URI to .env.local');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function connectToDatabase() {
  try {
    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'natpac_travel');
    
    // Return database instance with collections
    return {
      client,
      db,
      users: db.collection('users'),
      trips: db.collection('trips'),
      bookings: db.collection('bookings')
    };
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

// Database collections
export const collections = {
  users: 'users',
  trips: 'trips',
  bookings: 'bookings',
};

// Test database connection
export async function testConnection() {
  try {
    const { client, db } = await connectToDatabase();
    
    // Test the connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB connected successfully!");
    
    // Test database access
    const dbName = db.databaseName;
    console.log(`📊 Connected to database: ${dbName}`);
    
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    return false;
  }
}

// Initialize database collections with indexes
export async function initializeDatabase() {
  try {
    const { users, trips, bookings } = await connectToDatabase();
    
    // Create indexes for better performance
    await users.createIndex({ email: 1 }, { unique: true });
    await trips.createIndex({ userId: 1 });
    await trips.createIndex({ createdAt: -1 });
    await bookings.createIndex({ userId: 1 });
    await bookings.createIndex({ bookingReference: 1 }, { unique: true });
    await bookings.createIndex({ createdAt: -1 });
    
    console.log("🔍 Database indexes created successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return false;
  }
}
