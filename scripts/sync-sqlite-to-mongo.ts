
import Database from 'better-sqlite3';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FactCheck from '../src/models/FactCheck';
import User from '../src/models/User';
import Chat from '../src/models/Chat';

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
const dbPath = path.resolve(process.cwd(), 'chat_cache_v2.sqlite');
const db = new Database(dbPath, { readonly: true }); // Read-only to avoid locking issues

async function syncToMongo() {
    console.log('🔄 Starting Sync: SQLite -> MongoDB...');

    try {
        // 1. Connect to MongoDB
        await mongoose.connect(MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        // --- SYNC FACTS ---
        console.log('🧠 Syncing Fact Checks...');
        const stmt = db.prepare('SELECT * FROM fact_cache');
        const rows = stmt.all() as any[];
        console.log(`📂 Found ${rows.length} records in SQLite fact_cache.`);

        let syncedFacts = 0;
        let factErrors = 0;

        for (const row of rows) {
            try {
                const data = JSON.parse(row.data);
                const query = row.query;
                const updateData = {
                    query: query,
                    text: data.text,
                    claimant: data.claimant || 'Unknown',
                    rating: data.rating || 'Unknown',
                    publisher: data.publisher || 'Manual/Local',
                    date: data.date || new Date().toISOString(),
                    url: data.url || '',
                    source: 'cache-local-sync',
                };

                await FactCheck.findOneAndUpdate(
                    { query: query },
                    { $set: updateData },
                    { upsert: true, new: true }
                );
                syncedFacts++;
                if (syncedFacts % 10 === 0) process.stdout.write('.');
            } catch (err: any) {
                console.error(`\n❌ Failed to sync query "${row.query}":`, err.message);
                factErrors++;
            }
        }
        console.log(`\n✅ Facts Synced: ${syncedFacts}`);

        // --- SYNC USERS ---
        console.log('\n👥 Syncing Users...');
        const userStmt = db.prepare('SELECT * FROM users');
        const localUsers = userStmt.all() as any[];
        console.log(`📂 Found ${localUsers.length} users in SQLite.`);

        let syncedUsers = 0;
        for (const u of localUsers) {
            try {
                await User.findOneAndUpdate(
                    { email: u.email },
                    {
                        username: u.username,
                        password: u.password,
                        isVerified: u.isVerified === 1,
                        publicId: u.publicId // Sync ID back to Mongo if needed
                    },
                    { upsert: true, new: true }
                );
                syncedUsers++;
            } catch (err: any) {
                console.error(`❌ User Sync Failed (${u.email}):`, err.message);
            }
        }
        console.log(`✅ Users Synced: ${syncedUsers}`);

        // --- SYNC CHATS ---
        console.log('\n💬 Syncing Chat History...');
        const chatStmt = db.prepare('SELECT * FROM user_chats');
        const localChats = chatStmt.all() as any[];
        console.log(`📂 Found ${localChats.length} chats in SQLite.`);

        let syncedChats = 0;
        for (const c of localChats) {
            try {
                if (c.userId === 'guest') continue; // Don't sync guest chats to main DB

                const factCheckData = c.factCheck ? JSON.parse(c.factCheck) : undefined;

                await Chat.findOneAndUpdate(
                    { _id: c.id }, // Assuming ID matches or we use a unique constraint
                    {
                        text: c.text,
                        label: c.label,
                        score: c.score,
                        reason: c.reason,
                        userId: c.userId,
                        base64Image: c.base64Image,
                        imageHash: c.imageHash,
                        factCheck: factCheckData,
                        createdAt: new Date(c.createdAt)
                    },
                    { upsert: true, new: true }
                );
                syncedChats++;
            } catch (err: any) {
                console.error(`❌ Chat Sync Failed (${c.id}):`, err.message);
            }
        }
        console.log(`✅ Chats Synced: ${syncedChats}`);

        console.log(`\n\n🎉 Sync Complete!`);

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
