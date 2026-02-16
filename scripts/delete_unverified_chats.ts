
import 'dotenv/config';
import mongoose from 'mongoose';
import Database from 'better-sqlite3';
import path from 'path';
import Chat from '../src/models/Chat';
import dns from 'dns';

// DNS Workaround
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) { }

async function deleteUnverified() {
    console.log('--- Deleting Unverified/Unknown Chats ---');

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI not found.');
        process.exit(1);
    }

    let sqliteDb: any;

    try {
        // 1. Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 2. Connect to SQLite
        const dbPath = path.resolve(process.cwd(), 'chat_cache_v2.sqlite');
        sqliteDb = new Database(dbPath);
        console.log('✅ Connected to SQLite');

        // --- DEFINE CRITERIA ---
        const criteria = {
            $or: [
                { label: 'UNVERIFIED' },
                { 'factCheck.rating': { $regex: /Unverified|Unknown|Unable to Verify/i } }
            ]
        };

        // --- MONGODB DELETION ---
        console.log('\n[MongoDB] Searching for matches...');
        const mongoMatches = await Chat.find(criteria);
        console.log(`Found ${mongoMatches.length} matching chats in MongoDB.`);

        if (mongoMatches.length > 0) {
            const res = await Chat.deleteMany(criteria);
            console.log(`🗑️  Deleted ${res.deletedCount} chats from MongoDB.`);
        }

        // --- SQLITE DELETION ---
        console.log('\n[SQLite] Deleting matching chats...');

        const deleteStmt = sqliteDb.prepare(`
            DELETE FROM user_chats 
            WHERE label = 'UNVERIFIED'
            OR factCheck LIKE '%"rating":"Unverified%'
            OR factCheck LIKE '%"rating":"Unknown%'
            OR factCheck LIKE '%"rating":"Unable to Verify%'
        `);

        const sqliteRes = deleteStmt.run();
        console.log(`🗑️  Deleted ${sqliteRes.changes} chats from SQLite.`);

        console.log('\n🎉 Deletion Complete!');

    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        if (sqliteDb) sqliteDb.close();
        await mongoose.disconnect();
    }
}

deleteUnverified();
