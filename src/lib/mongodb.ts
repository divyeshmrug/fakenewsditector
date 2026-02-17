import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI;

if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI environment variable is not defined.');
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is NOT defined. Please check Vercel settings.');
    }

    const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, clientOptions as any).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('MongoDB Connection Error:', e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
