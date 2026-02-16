
import mongoose from 'mongoose';
import db from './src/lib/sqlite';
import User from './src/models/User';
import dotenv from 'dotenv';
import dns from 'dns';

// DNS Workaround for MongoDB Atlas
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('Using Google DNS for MongoDB connection');
} catch (e) {
    console.error('Failed to set DNS servers:', e);
}

dotenv.config();

async function checkDatabases() {
    console.log('--- Debugging Database Content ---');

    // 1. Check SQLite
    try {
        console.log('\n[SQLite] Checking "users" table...');
        const users = db.prepare('SELECT * FROM users ORDER BY createdAt DESC LIMIT 5').all();
        if (users.length === 0) {
            console.log('⚠️ SQLite "users" table is empty.');
        } else {
            console.table(users);
        }
    } catch (e: any) {
        console.error('❌ SQLite Error:', e.message);
    }

    // 2. Check MongoDB
    try {
        console.log('\n[MongoDB] Connecting...');
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing in .env');
        }
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('[MongoDB] Checking "users" collection...');
        const mongoUsers = await User.find({ email: 'paramdetroja9911@gmail.com' }).lean();

        if (mongoUsers.length === 0) {
            console.log('⚠️ MongoDB: User "paramdetroja9911@gmail.com" NOT FOUND.');
        } else {
            console.log('[MongoDB] User "param":', JSON.stringify(mongoUsers, null, 2));
        }

    } catch (e: any) {
        console.error('❌ MongoDB Error:', e.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkDatabases();
