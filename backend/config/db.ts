/**
 * Database configuration and connection manager for MongoDB
 */
import mongoose from 'mongoose';

// Fail fast in containerized environments without active MongoDB
mongoose.set('bufferCommands', false);

export interface DbStatus {
  isConnected: boolean;
  host?: string;
  name?: string;
  error?: string;
}

let dbStatus: DbStatus = {
  isConnected: false,
};

export async function connectDB(mongoUri?: string): Promise<DbStatus> {
  const uri = mongoUri || process.env.MONGODB_URI ;
//|| 'mongodb://localhost:27017/prime_properties'-remove this after devlopment
  if (!uri || uri.includes('username:password')) {
    console.warn('[MongoDB] No valid MONGODB_URI configured in environment. Using in-memory fallback store.');
    dbStatus = {
      isConnected: false,
      error: 'MONGODB_URI not configured or contains placeholder credentials',
    };
    return dbStatus;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    dbStatus = {
      isConnected: true,
      host: conn.connection.host,
      name: conn.connection.name,
    };
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}/${conn.connection.name}`);
    return dbStatus;
  } catch (err: any) {
    console.warn(`[MongoDB] Connection failed: ${err.message}. Operating in fallback mode.`);
    dbStatus = {
      isConnected: false,
      error: err.message,
    };
    return dbStatus;
  }
}

export function getDbStatus(): DbStatus {
  return {
    ...dbStatus,
    isConnected: mongoose.connection.readyState === 1,
  };
}

export default { connectDB, getDbStatus };
