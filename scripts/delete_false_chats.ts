
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

async function deleteFalse() {
    console.log('--- Deleting False/Misleading Chats ---');

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
                { label: { $in: ['FALSE', 'MISLEADING'] } },
                { 'factCheck.rating': { $regex: /False|Scam|Altered/i } },
                { 'factCheck.rating': 'FALSE' }
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

        // We can't use complex regex in SQLite easily, so we'll iterate or use basic LIKE
        // Safer to fetch IDs from MongoDB deletion if possible, but we just deleted them.
        // Let's rely on the same logic but adapted for SQLite.

        const deleteStmt = sqliteDb.prepare(`
            DELETE FROM user_chats 
            WHERE label IN ('FALSE', 'MISLEADING')
            OR factCheck LIKE '%"rating":"False%'
            OR factCheck LIKE '%"rating":"FALSE%'
            OR factCheck LIKE '%"rating":"Scam%'
            OR factCheck LIKE '%"rating":"Altered%'
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

deleteFalse();
