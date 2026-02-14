
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import dns from 'dns';

// Force usage of Google Public DNS to bypass local resolution issues
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('🌍 DNS servers set to Google Public DNS (8.8.8.8)');
} catch (e) {
    console.warn('⚠️ Failed to set custom DNS servers:', e);
}

const MONGODB_URI = process.env.VITE_MONGODB_URI || process.env.MONGODB_URI;

console.log('---------------------------------------------------');
console.log('🧪 Testing MongoDB Connection...');
console.log(`📡 URI: ${MONGODB_URI ? MONGODB_URI.replace(/:([^:@]+)@/, ':****@') : 'Undefined'}`);
console.log('---------------------------------------------------');

if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is missing in .env');
    process.exit(1);
}

const testConnection = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
            socketTimeoutMS: 45000,
        });
        console.log('✅ SUCCESS: Connected to MongoDB successfully!');

        // List collections to verify read access
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📂 Collections found: ${collections.map(c => c.name).join(', ')}`);

        await mongoose.disconnect();
        console.log('🔌 Disconnected.');
    } catch (error: any) {
        console.error('❌ CONNECTION FAILED:');
        console.error(`   Code: ${error.code}`);
        console.error(`   Message: ${error.message}`);
        console.error(`   Name: ${error.name}`);
        if (error.cause) console.error('   Cause:', error.cause);
    }
};

testConnection();
