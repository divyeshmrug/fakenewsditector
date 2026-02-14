
import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'dns';

// Force Google DNS
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('Using Google DNS');
} catch (e) {
    console.warn('Could not set DNS servers');
}

const testDB = async () => {
    const uri = process.env.VITE_MONGODB_URI || process.env.MONGODB_URI;
    console.log('Testing MongoDB Connection...');
    console.log('URI:', uri?.split('@')[1]); // Log only the host part for privacy

    if (!uri) {
        console.error('❌ No MONGODB_URI found in .env');
        return;
    }

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ MongoDB Connection Successful!');
        console.log('State:', mongoose.connection.readyState);
        await mongoose.disconnect();
    } catch (error: any) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        if (error.name === 'MongooseServerSelectionError') {
            console.error('   -> Possible Cause: IP Address blocked or Bad Internet Connection.');
        }
    }
};

testDB();
