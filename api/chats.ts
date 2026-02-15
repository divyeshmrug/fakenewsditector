import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import dbConnect from '../src/lib/mongodb';
import Chat from '../src/models/Chat';
import { saveToSQLite, findInSQLite, getHistoryFromSQLite } from '../src/lib/sqlite';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    let userId: string | null = null;

    // Verify JWT Token from Custom Auth
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            userId = decoded.userId;
        }
    } catch (err) {
        console.error('Token verification failed:', err);
    }

    if (!userId) {
        // Fallback for demo/guest mode if validation fails or no token
        userId = 'guest-user-123';
    }

    const { method, query } = req;

    const conn = await dbConnect();
    const isDbConnected = conn && conn.connection.readyState === 1;

    switch (method) {
        case 'GET':
            try {
                // Support for image hash cache check (?imageHash=hash_value)
                if (query.imageHash) {
                    const hashToSearch = query.imageHash as string;

                    // Check MongoDB for cached image analysis
                    let cachedImageInMongo = null;
                    if (isDbConnected) {
                        cachedImageInMongo = await Chat.findOne({ imageHash: hashToSearch, userId });
                    }

                    if (cachedImageInMongo) {
                        return res.status(200).json({ success: true, data: cachedImageInMongo, source: 'mongodb-image-cache' });
                    }

                    return res.status(200).json({ success: true, data: null });
                }

                // Support for text cache check (?q=normalized_text)
                if (query.q) {
                    const textToSearch = query.q as string;

                    // 1. Check SQLite first for speed (only if it's the same user's cache)
                    const cachedInSQLite = findInSQLite(textToSearch);
                    if (cachedInSQLite && cachedInSQLite.userId === userId) {
                        return res.status(200).json({ success: true, data: cachedInSQLite, source: 'sqlite' });
                    }

                    // 2. Check MongoDB
                    let cachedInMongo = null;
                    if (isDbConnected) {
                        cachedInMongo = await Chat.findOne({ text: textToSearch, userId });
                    }

                    if (cachedInMongo) {
                        // Fill SQLite cache for next time
                        saveToSQLite(cachedInMongo._id.toString(), cachedInMongo);
                        return res.status(200).json({ success: true, data: cachedInMongo, source: 'mongodb' });
                    }

                    return res.status(200).json({ success: true, data: null });
                }

                // Default: Get History for current user
                if (!isDbConnected) {
                    // Fallback to SQLite
                    const chats = getHistoryFromSQLite(userId || 'guest');
                    return res.status(200).json({ success: true, data: chats, source: 'sqlite-local' });
                }
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

                let chat;
                if (isDbConnected) {
                    chat = await Chat.create(chatData);
                } else {
                    // Mock chat object for SQLite only mode
                    chat = { ...chatData, _id: new Date().getTime() }; // Fake ID
                }

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

        case 'DELETE':
            try {
                const { id } = query;
                if (!id || typeof id !== 'string') {
                    return res.status(400).json({ success: false, error: 'Chat ID is required' });
                }

                // Delete from MongoDB if connected
                if (isDbConnected) {
                    await Chat.deleteOne({ _id: id, userId });
                }

                // Always try to delete from SQLite cache
                try {
                    // Import dynamically to avoid circular dependency issues if any, though explicit import is better
                    const { deleteFromSQLite } = await import('../src/lib/sqlite');
                    deleteFromSQLite(id);
                } catch (sqliteErr) {
                    console.error('Failed to delete from SQLite:', sqliteErr);
                }

                res.status(200).json({ success: true, message: 'Chat deleted successfully' });
            } catch (error: any) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
