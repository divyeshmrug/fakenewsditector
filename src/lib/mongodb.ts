import mongoose from 'mongoose';

// Cross-environment MONGODB_URI resolution (Vite vs Node)
const MONGODB_URI = (typeof process !== 'undefined' ? process.env.MONGODB_URI : undefined) ||
    (typeof import.meta !== 'undefined' && 'env' in import.meta ? (import.meta as any).env.VITE_MONGODB_URI : undefined);

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    cached.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => {
        return mongoose;
    });

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
