
import 'dotenv/config';
import mongoose from 'mongoose';
import Database from 'better-sqlite3';
import path from 'path';
import User from '../src/models/User';
import Counter from '../src/models/Counter';
import dns from 'dns';

// DNS Workaround
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) { }

async function resetUsers() {
    console.log('--- Reseting User Accounts (Preserving Data) ---');

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

        // --- MONGODB OPERATIONS ---
        console.log('\n[MongoDB] Deleting Users...');
        const userDel = await User.deleteMany({});
        console.log(`🗑️  Deleted ${userDel.deletedCount} users.`);

        console.log('[MongoDB] Resetting User ID Counter...');
        const counterDel = await Counter.deleteMany({ _id: 'userId' });
        console.log(`️  Reset ${counterDel.deletedCount} counter(s).`);

        // --- SQLITE OPERATIONS ---
        console.log('\n[SQLite] Deleting Users...');
        const sqliteDel = sqliteDb.prepare('DELETE FROM users').run();
        console.log(`🗑️  Deleted ${sqliteDel.changes} users.`);

        // --- VERIFICATION ---
        const userCountMongo = await User.countDocuments();
        const chatCountMongo = await mongoose.connection.collection('chats').countDocuments();

        const userCountSqlite = sqliteDb.prepare('SELECT count(*) as count FROM users').get().count;
        const chatCountSqlite = sqliteDb.prepare('SELECT count(*) as count FROM user_chats').get().count;

        console.log('\n--- Final Stats ---');
        console.log(`Users (Mongo): ${userCountMongo}`);
        console.log(`Users (SQLite): ${userCountSqlite}`);
        console.log(`Chats (Mongo - Preserved): ${chatCountMongo}`);
        console.log(`Chats (SQLite - Preserved): ${chatCountSqlite}`);

        console.log('\n🎉 Reset Complete! Next user will be axiant_intelligence_000001.');

    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        if (sqliteDb) sqliteDb.close();
        await mongoose.disconnect();
    }
}

resetUsers();
