import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
    if (!MONGODB_URI || MONGODB_URI.includes('<db_password>')) {
        console.error('❌ Error: MONGODB_URI is not configured or still contains the <db_password> placeholder.');
        console.log('Please update your .env file with the actual password.');
        process.exit(1);
    }

    console.log('⏳ Connecting to MongoDB...');
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Successfully connected to MongoDB!');
        await mongoose.connection.close();
        console.log('🔌 Connection closed.');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
}

testConnection();
