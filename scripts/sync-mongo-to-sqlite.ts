
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
const dbPath = path.resolve(process.cwd(), 'chat_cache_v2.sqlite');
const db = new Database(dbPath, { timeout: 20000 }); // Read-Write Mode with 20s timeout

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
                publicId TEXT,
                username TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                isVerified INTEGER DEFAULT 0,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS user_chats (
                id TEXT PRIMARY KEY,
                userId TEXT,
                text TEXT NOT NULL,
                label TEXT NOT NULL,
                score INTEGER NOT NULL,
                reason TEXT NOT NULL,
                factCheck TEXT,
                base64Image TEXT,
                imageHash TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // --- SYNC USERS ---
        console.log('👥 Syncing Users...');
        const users = await User.find({}).lean();
        console.log(`📂 Found ${users.length} users in MongoDB.`);

        // 1. Insert/Update
        const insertUser = db.prepare(`
            INSERT OR REPLACE INTO users (id, publicId, username, email, password, isVerified)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        let userCount = 0;
        const userTx = db.transaction((userList) => {
            for (const u of userList) {
                insertUser.run(
                    u._id.toString(),
                    u.publicId || null,
                    u.username,
                    u.email,
                    u.password,
                    u.isVerified ? 1 : 0
                );
                userCount++;
            }
        });
        userTx(users);
        console.log(`✅ Upserted ${userCount} users.`);

        // 2. Delete missing users
        const mongoUserIds = users.map(u => u._id.toString());
        if (mongoUserIds.length > 0) {
            const deleteUserStmt = db.prepare(`DELETE FROM users WHERE id NOT IN (${mongoUserIds.map(() => '?').join(',')})`);
            const info = deleteUserStmt.run(...mongoUserIds);
            if (info.changes > 0) console.log(`🗑️ Deleted ${info.changes} users from SQLite (not in Mongo).`);
        } else {
            // If Mongo is empty, clear SQLite
            db.prepare('DELETE FROM users').run();
            console.log('🗑️ Deleted all users from SQLite (Mongo is empty).');
        }


        // --- SYNC CHATS ---
        console.log('💬 Syncing Chat History...');
        const chats = await mongoose.connection.collection('chats').find({}).toArray();
        console.log(`📂 Found ${chats.length} chats in MongoDB.`);

        const insertChat = db.prepare(`
            INSERT OR REPLACE INTO user_chats (id, userId, text, label, score, reason, factCheck, base64Image, imageHash, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        let chatCount = 0;
        const chatTx = db.transaction((chatList) => {
            for (const c of chatList) {
                insertChat.run(
                    c._id.toString(),
                    c.userId,
                    c.text,
                    c.label,
                    c.score,
                    c.reason,
                    JSON.stringify(c.factCheck),
                    c.base64Image || null,
                    c.imageHash || null,
                    c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString()
                );
                chatCount++;
            }
        });
        chatTx(chats);
        console.log(`✅ Upserted ${chatCount} chats.`);

        // Delete missing chats
        const mongoChatIds = chats.map(c => c._id.toString());
        if (mongoChatIds.length > 0) {
            // Batch delete might be needed for very large datasets, but for now this is fine
            // SQLite limit is usually high enough, but let's be safe and catch errors if needed
            try {
                const deleteChatStmt = db.prepare(`DELETE FROM user_chats WHERE id NOT IN (${mongoChatIds.map(() => '?').join(',')})`);
                const info = deleteChatStmt.run(...mongoChatIds);
                if (info.changes > 0) console.log(`🗑️ Deleted ${info.changes} chats from SQLite.`);
            } catch (e) {
                console.warn('⚠️ Batch delete failed (too many params?), skipping pruning for now.');
            }
        } else {
            db.prepare('DELETE FROM user_chats').run();
            console.log('🗑️ Deleted all chats from SQLite.');
        }

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
                    // console.error(`❌ Failed to sync query "${fact.query}":`, err.message);
                    errorCount++;
                }
            }
        });

        runTransaction(facts);
        console.log(`✅ Upserted ${syncedCount} facts.`);

        // Delete missing facts
        const mongoQueries = facts.map(f => f.query);
        if (mongoQueries.length > 0) {
            try {
                const deleteFactStmt = db.prepare(`DELETE FROM fact_cache WHERE query NOT IN (${mongoQueries.map(() => '?').join(',')})`);
                const info = deleteFactStmt.run(...mongoQueries);
                if (info.changes > 0) console.log(`🗑️ Deleted ${info.changes} facts from SQLite.`);
            } catch (e) {
                console.warn('⚠️ Batch delete failed for facts.');
            }
        } else {
            db.prepare('DELETE FROM fact_cache').run();
            console.log('🗑️ Deleted all facts from SQLite.');
        }

        console.log(`\n\n🎉 Reverse Sync Complete!`);
        console.log(`✅ Users Synced: ${userCount}`);
        console.log(`✅ Chats Synced: ${chatCount}`);
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
