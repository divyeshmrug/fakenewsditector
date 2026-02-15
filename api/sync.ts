import type { VercelRequest, VercelResponse } from '@vercel/node';
import Database from 'better-sqlite3';
import path from 'path';
import mongoose from 'mongoose';
import Chat from '../src/models/Chat';
import User from '../src/models/User';
import FactCheck from '../src/models/FactCheck';
import dbConnect from '../src/lib/mongodb';

// Load env explicitly if needed, though Vercel/Local server usually handles it
const MONGODB_URI = process.env.VITE_MONGODB_URI || process.env.MONGODB_URI;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    console.log('[Sync] Starting Database Synchronization...');
    const results = {
        users: { pulled: 0, pushed: 0 },
        chats: { pulled: 0, pushed: 0 },
        facts: { pulled: 0, pushed: 0 },
        errors: [] as string[]
    };

    let db: any = null;

    try {
        // 1. Connect to MongoDB
        await dbConnect();

        // 2. Connect to SQLite
        const dbPath = path.resolve(process.cwd(), 'chat_cache.sqlite');
        db = new Database(dbPath);

        // --- PHASE 1: PULL (Mongo -> SQLite) ---
        console.log('[Sync] Phase 1: Pulling from Cloud...');

        // Users
        const mongoUsers = await User.find({}).lean();
        const insertUser = db.prepare(`
            INSERT OR REPLACE INTO users (id, username, email, password, isVerified)
            VALUES (?, ?, ?, ?, ?)
        `);
        const userTx = db.transaction((users: any[]) => {
            for (const u of users) {
                insertUser.run(u._id.toString(), u.username, u.email, u.password, u.isVerified ? 1 : 0);
                results.users.pulled++;
            }
        });
        userTx(mongoUsers);

        // Delete missing users
        const mongoUserIds = mongoUsers.map(u => u._id.toString());
        if (mongoUserIds.length > 0) {
            const deleteUserStmt = db.prepare(`DELETE FROM users WHERE id NOT IN (${mongoUserIds.map(() => '?').join(',')})`);
            deleteUserStmt.run(...mongoUserIds);
        } else {
            db.prepare('DELETE FROM users').run();
        }

        // Facts
        const mongoFacts = await FactCheck.find({}).lean();
        const insertFact = db.prepare('INSERT OR REPLACE INTO fact_cache (query, data) VALUES (?, ?)');
        const factTx = db.transaction((facts: any[]) => {
            for (const f of facts) {
                const dataObj = {
                    text: f.text,
                    claimant: f.claimant,
                    rating: f.rating,
                    publisher: f.publisher,
                    date: f.date,
                    url: f.url,
                    source: f.source || 'mongo-sync'
                };
                insertFact.run(f.query, JSON.stringify(dataObj));
                results.facts.pulled++;
            }
        });
        factTx(mongoFacts);

        // Delete missing facts
        const mongoQueries = mongoFacts.map(f => f.query);
        if (mongoQueries.length > 0) {
            try {
                const deleteFactStmt = db.prepare(`DELETE FROM fact_cache WHERE query NOT IN (${mongoQueries.map(() => '?').join(',')})`);
                deleteFactStmt.run(...mongoQueries);
            } catch (e) {
                // ignore batch error
            }
        } else {
            db.prepare('DELETE FROM fact_cache').run();
        }

        // --- PHASE 2: PUSH (SQLite -> Mongo) ---
        console.log('[Sync] Phase 2: Pushing to Cloud...');

        // Chats (Only push non-guest chats)
        const localChats = db.prepare('SELECT * FROM user_chats WHERE userId != "guest"').all() as any[];
        for (const c of localChats) {
            try {
                const factCheckData = c.factCheck ? JSON.parse(c.factCheck) : undefined;
                await Chat.findOneAndUpdate(
                    { _id: c.id },
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
                results.chats.pushed++;
            } catch (err: any) {
                results.errors.push(`Chat Push Error (${c.id}): ${err.message}`);
            }
        }

        // Users (Push verified status back if changed locally - though uncommon)
        const localUsers = db.prepare('SELECT * FROM users').all() as any[];
        for (const u of localUsers) {
            try {
                await User.findOneAndUpdate(
                    { email: u.email },
                    {
                        username: u.username,
                        password: u.password,
                        isVerified: u.isVerified === 1
                    },
                    { upsert: true, new: true }
                );
                results.users.pushed++;
            } catch (err: any) {
                results.errors.push(`User Push Error (${u.email}): ${err.message}`);
            }
        }

        console.log('[Sync] Completed Successfully.');
        res.json({ success: true, results });

    } catch (error: any) {
        console.error('[Sync] Fatal Error:', error);
        res.status(500).json({ success: false, message: error.message, results });
    } finally {
        if (db) db.close();
    }
}
