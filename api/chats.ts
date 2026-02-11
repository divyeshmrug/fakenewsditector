import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClerkClient } from '@clerk/backend';
import dbConnect from '../src/lib/mongodb';
import Chat from '../src/models/Chat';
import { saveToSQLite, findInSQLite } from '../src/lib/sqlite';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    let userId: string | null = null;
    try {
        const authRequest = {
            url: `https://${req.headers.host}${req.url}`,
            method: req.method!,
            headers: new Headers(req.headers as any),
        };
        const authState = await clerk.authenticateRequest(authRequest as any);
        if (authState.status === 'signed-in') {
            userId = authState.toAuth().userId;
        }
    } catch (err) {
        console.error('Auth verification failed:', err);
    }

    if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { method, query } = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                // Support for cache check (?q=normalized_text)
                if (query.q) {
                    const textToSearch = query.q as string;

                    // 1. Check SQLite first for speed (only if it's the same user's cache)
                    const cachedInSQLite = findInSQLite(textToSearch);
                    if (cachedInSQLite && cachedInSQLite.userId === userId) {
                        return res.status(200).json({ success: true, data: cachedInSQLite, source: 'sqlite' });
                    }

                    // 2. Check MongoDB
                    const cachedInMongo = await Chat.findOne({ text: textToSearch, userId });
                    if (cachedInMongo) {
                        // Fill SQLite cache for next time
                        saveToSQLite(cachedInMongo._id.toString(), cachedInMongo);
                        return res.status(200).json({ success: true, data: cachedInMongo, source: 'mongodb' });
                    }

                    return res.status(200).json({ success: true, data: null });
                }

                // Default: Get History for current user
                const chats = await Chat.find({ userId }).sort({ createdAt: -1 }).limit(20);
                res.status(200).json({ success: true, data: chats });
            } catch (error: any) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            try {
                // Save to MongoDB with userId
                const chatData = { ...req.body, userId };
                const chat = await Chat.create(chatData);

                // Save to SQLite
                try {
                    saveToSQLite(chat._id.toString(), chatData);
                } catch (sqliteErr) {
                    console.error('Failed to save to SQLite:', sqliteErr);
                }

                res.status(201).json({ success: true, data: chat });
            } catch (error: any) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
