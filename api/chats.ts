import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import dbConnect from '../src/lib/mongodb';
import Chat from '../src/models/Chat';
import { saveToSQLite, findInSQLite, getHistoryFromSQLite, findInSQLiteByHash } from '../src/lib/sqlite';
import fs from 'fs';
import path from 'path';

const debugLog = (msg: string) => {
    try {
        const logPath = path.join(process.cwd(), 'debug_api.log');
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
    } catch (e) { }
};

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
                    const textFilter = query.q as string;

                    debugLog(`Image Cache Check: hash=${hashToSearch}, text=${textFilter || 'EMPTY'}, user=${userId}`);

                    // 1. Check SQLite first
                    try {
                        const cachedInSQLite = findInSQLiteByHash(hashToSearch, textFilter || undefined);
                        if (cachedInSQLite && cachedInSQLite.userId === userId) {
                            // EXTRA SAFE: Ensure text matches if filter was provided
                            if (!textFilter || cachedInSQLite.text === textFilter) {
                                debugLog('Image Cache Hit (SQLite)');
                                return res.status(200).json({ success: true, data: cachedInSQLite, source: 'sqlite-image-cache' });
                            }
                        }
                    } catch (err) {
                        debugLog(`SQLite Error: ${err}`);
                    }

                    // 2. Check MongoDB for cached image analysis
                    let cachedImageInMongo = null;
                    if (isDbConnected) {
                        try {
                            const filter: any = { imageHash: hashToSearch, userId };
                            if (textFilter) filter.text = textFilter;

                            debugLog(`MongoDB Filter: ${JSON.stringify(filter)}`);
                            cachedImageInMongo = await Chat.findOne(filter);
                        } catch (mongoErr) {
                            debugLog(`MongoDB Error: ${mongoErr}`);
                        }
                    }

                    if (cachedImageInMongo) {
                        debugLog('Image Cache Hit (MongoDB)');
                        return res.status(200).json({ success: true, data: cachedImageInMongo, source: 'mongodb-image-cache' });
                    }

                    debugLog('Image Cache Miss');
                    return res.status(200).json({ success: true, data: null });
                }

                // Support for text cache check (?q=normalized_text)
                if (query.q) {
                    const textToSearch = query.q as string;

                    // 1. Check SQLite first for speed (only if it's the same user's cache)
                    const cachedInSQLite = findInSQLite(textToSearch);
                    if (cachedInSQLite && cachedInSQLite.userId === userId) {
                        // Smart Caching: Only use cache if result was TRUE
                        const isTrue = cachedInSQLite.label === 'TRUE' ||
                            (cachedInSQLite.factCheck && cachedInSQLite.factCheck.rating === 'True');

                        if (isTrue) {
                            return res.status(200).json({ success: true, data: cachedInSQLite, source: 'sqlite' });
                        }
                    }

                    // 2. Check MongoDB
                    let cachedInMongo = null;
                    if (isDbConnected) {
                        cachedInMongo = await Chat.findOne({ text: textToSearch, userId });
                    }

                    if (cachedInMongo) {
                        // Smart Caching: Only use cache if result was TRUE
                        const isTrue = cachedInMongo.label === 'TRUE' ||
                            (cachedInMongo.factCheck && cachedInMongo.factCheck.rating === 'True');

                        if (isTrue) {
                            // Fill SQLite cache for next time
                            saveToSQLite(cachedInMongo._id.toString(), cachedInMongo);
                            return res.status(200).json({ success: true, data: cachedInMongo, source: 'mongodb' });
                        }
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
                // Support parsing IDs from query param, body, or path params
                const id = (query.id || req.query.id || req.body.id || ((req as any).params && (req as any).params.id)) as string;

                let releaseIds: string[] = [];
                // Check query.ids first
                if (query.ids) {
                    releaseIds = (query.ids as string).split(',');
                } else if (req.body && req.body.ids) {
                    releaseIds = req.body.ids;
                }

                console.log('[API] DELETE handler called. Debug Query:', JSON.stringify(query), 'Direct ID:', id, 'Release IDs:', releaseIds);

                // Strategy: Collect all IDs to delete
                const idsToDelete: string[] = [];
                if (id) idsToDelete.push(id);
                if (releaseIds && Array.isArray(releaseIds)) idsToDelete.push(...releaseIds);

                if (idsToDelete.length === 0) {
                    return res.status(400).json({ success: false, error: 'Chat ID(s) are required' });
                }

                // Delete from MongoDB if connected
                if (isDbConnected) {
                    await Chat.deleteMany({ _id: { $in: idsToDelete }, userId });
                } // Ensure no hanging brace or syntax error here

                // Delete from SQLite cache
                try {
                    // Import dynamically to avoid circular dependency issues
                    const { deleteFromSQLite } = await import('../src/lib/sqlite');
                    // SQLite delete might be one-by-one or we typically might need a bulk delete function in sqlite lib
                    // For now, loop through and delete them. It's fast enough for local SQLite.
                    for (const delId of idsToDelete) {
                        deleteFromSQLite(delId);
                    }
                } catch (sqliteErr) {
                    console.error('Failed to delete from SQLite:', sqliteErr);
                }

                res.status(200).json({ success: true, message: `Successfully deleted ${idsToDelete.length} chat(s)` });
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
