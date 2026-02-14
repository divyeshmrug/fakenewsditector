
import Database from 'better-sqlite3';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FactCheck from '../src/models/FactCheck';

// Load environment variables
dotenv.config();

import dns from 'dns';

// Force usage of Google Public DNS to bypass local resolution issues
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
const db = new Database(dbPath, { readonly: true }); // Read-only to avoid locking issues

async function syncToMongo() {
    console.log('🔄 Starting Sync: SQLite -> MongoDB...');

    try {
        // 1. Connect to MongoDB
        await mongoose.connect(MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        // 2. Read from SQLite
        const stmt = db.prepare('SELECT * FROM fact_cache');
        const rows = stmt.all() as any[];
        console.log(`📂 Found ${rows.length} records in SQLite fact_cache.`);

        let syncedCount = 0;
        let errorCount = 0;

        // 3. Sync Loop
        for (const row of rows) {
            try {
                const data = JSON.parse(row.data);
                const query = row.query;

                // Prepare the document
                // We defer to the existing data structure in SQLite
                const updateData = {
                    query: query,
                    text: data.text,
                    claimant: data.claimant || 'Unknown',
                    rating: data.rating || 'Unknown',
                    publisher: data.publisher || 'Manual/Local',
                    date: data.date || new Date().toISOString(),
                    url: data.url || '',
                    source: 'cache-local-sync', // Mark as synced from local
                    // Preserve original creation time if needed, or use SQLite's
                };

                // Upsert into MongoDB (Insert if new, Update if exists)
                await FactCheck.findOneAndUpdate(
                    { query: query },
                    { $set: updateData },
                    { upsert: true, new: true }
                );

                syncedCount++;
                if (syncedCount % 10 === 0) process.stdout.write('.');

            } catch (err: any) {
                console.error(`\n❌ Failed to sync query "${row.query}":`, err.message);
                errorCount++;
            }
        }

        console.log(`\n\n🎉 Sync Complete!`);
        console.log(`✅ Successfully synced: ${syncedCount}`);
        if (errorCount > 0) console.log(`⚠️ Errors: ${errorCount}`);

    } catch (error) {
        console.error('❌ Fatal Sync Error:', error);
    } finally {
        // 4. Cleanup
        db.close();
        await mongoose.disconnect();
        console.log('🔌 Connections closed.');
    }
}

// Run the sync
syncToMongo();
