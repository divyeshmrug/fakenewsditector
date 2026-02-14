
import Database from 'better-sqlite3';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FactCheck from '../src/models/FactCheck';
import User from '../src/models/User';

// Load environment variables
dotenv.config();

import dns from 'dns';

// Force usage of Google Public DNS
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    // Ignore
}

const MONGODB_URI = process.env.VITE_MONGODB_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI not found in .env file.');
    process.exit(1);
}

// SQLite Configuration
const dbPath = path.resolve(process.cwd(), 'chat_cache.sqlite');
const db = new Database(dbPath); // Read-Write Mode

async function syncToSqlite() {
    console.log('🔄 Starting Reverse Sync: MongoDB -> SQLite...');

    try {
        // 1. Connect to MongoDB
        await mongoose.connect(MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');



        // 3. Prepare SQLite Tables
        db.exec(`
            CREATE TABLE IF NOT EXISTS fact_cache (
                query TEXT PRIMARY KEY,
                data TEXT
            );
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                isVerified INTEGER DEFAULT 0,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // --- SYNC USERS ---
        console.log('👥 Syncing Users...');
        const users = await User.find({}).lean();
        console.log(`📂 Found ${users.length} users in MongoDB.`);

        const insertUser = db.prepare(`
            INSERT OR REPLACE INTO users (id, username, email, password, isVerified)
            VALUES (?, ?, ?, ?, ?)
        `);

        let userCount = 0;
        const userTx = db.transaction((userList) => {
            for (const u of userList) {
                insertUser.run(
                    u._id.toString(),
                    u.username,
                    u.email,
                    u.password,
                    u.isVerified ? 1 : 0
                );
                userCount++;
            }
        });
        userTx(users);
        console.log(`✅ Synced ${userCount} users.`);

        // --- SYNC FACTS ---
        console.log('🧠 Syncing Fact Checks...');
        const facts = await FactCheck.find({}).lean();
        console.log(`📂 Found ${facts.length} facts in MongoDB.`);

        // 4. Sync Loop (Facts)
        const insertStmt = db.prepare(`
            INSERT OR REPLACE INTO fact_cache (query, data) VALUES (?, ?)
        `);

        let syncedCount = 0;
        let errorCount = 0;

        const runTransaction = db.transaction((factsToSync) => {
            for (const fact of factsToSync) {
                try {
                    const query = fact.query;

                    // Reconstruct the 'data' JSON object expected by the app
                    const dataObj = {
                        text: fact.text,
                        claimant: fact.claimant,
                        rating: fact.rating,
                        publisher: fact.publisher,
                        date: fact.date,
                        url: fact.url,
                        source: fact.source || 'mongo-sync'
                    };

                    insertStmt.run(query, JSON.stringify(dataObj));
                    syncedCount++;
                } catch (err: any) {
                    console.error(`❌ Failed to sync query "${fact.query}":`, err.message);
                    errorCount++;
                }
            }
        });

        runTransaction(facts);

        console.log(`\n\n🎉 Reverse Sync Complete!`);
        console.log(`✅ Users Synced: ${userCount}`);
        console.log(`✅ Facts Synced: ${syncedCount}`);

    } catch (error) {
        console.error('❌ Fatal Sync Error:', error);
    } finally {
        // 5. Cleanup
        db.close();
        await mongoose.disconnect();
        console.log('🔌 Connections closed.');
    }
}

// Run the sync
syncToSqlite();
