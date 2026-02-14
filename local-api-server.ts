
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dns from 'dns';

// FIX: Force Google DNS to resolve MongoDB Atlas SRV records
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('Using Google DNS for MongoDB connection');
} catch (e) {
    console.error('Failed to set DNS servers:', e);
}
// import dotenv from 'dotenv'; // Removed manual import
import chatHandler from './api/chats';
import factCheckHandler from './api/fact-check';

// dotenv.config(); // Removed manual config

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Helper wrapper for async handlers
const wrap = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res)).catch(next);
};

// Adapter for Vercel handler
app.all('/api/chats', wrap(chatHandler));
app.post('/api/fact-check', wrap(factCheckHandler));

// Auth Routes
import * as auth from './api/auth';
app.post('/api/auth/signup', wrap(auth.signup));
app.post('/api/auth/verify', wrap(auth.verify));
app.post('/api/auth/login', wrap(auth.login));
app.post('/api/auth/forgot-password', wrap(auth.forgotPassword));
app.post('/api/auth/reset-password', wrap(auth.resetPassword));

// Cache Sync Function
import dbConnect from './src/lib/mongodb';
import FactCheck from './src/models/FactCheck';
import { saveFactCache } from './src/lib/sqlite';

const syncCache = async () => {
    try {
        console.log('[Sync] Connecting to Cloud DB...');
        await dbConnect();

        // Fetch latest 100 fact checks from MongoDB
        const checks = await FactCheck.find().sort({ createdAt: -1 }).limit(100);
        console.log(`[Sync] Found ${checks.length} facts in Cloud. Downloading...`);

        let count = 0;
        checks.forEach((check: any) => {
            saveFactCache(check.query, {
                text: check.text,
                claimant: check.claimant,
                rating: check.rating,
                publisher: check.publisher,
                date: check.date,
                url: check.url
            });
            count++;
        });
        console.log(`[Sync] Success! ${count} facts updated in Local Cache.`);
    } catch (e) {
        console.error('[Sync] Failed (Offline?):', e);
    }
};

app.listen(port, () => {
    console.log(`Local API server running at http://localhost:${port}`);
    // Run sync in background
    syncCache();
});
