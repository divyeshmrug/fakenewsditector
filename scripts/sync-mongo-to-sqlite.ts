
import Database from 'better-sqlite3';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FactCheck from '../src/models/FactCheck';

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

        // 2. Fetch all facts from MongoDB
        const facts = await FactCheck.find({}).lean();
        console.log(`📂 Found ${facts.length} records in MongoDB.`);

        // 3. Prepare SQLite Table (Ensure it exists)
        db.exec(`
            CREATE TABLE IF NOT EXISTS fact_cache (
                query TEXT PRIMARY KEY,
                data TEXT
            )
        `);

        // 4. Sync Loop
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
        console.log(`✅ Successfully downloaded: ${syncedCount}`);

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
