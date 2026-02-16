import path from 'path';

let db: any;
let sqliteAvailable = false;

try {
  const Database = await import('better-sqlite3');
<<<<<<< HEAD
  const dbPath = path.resolve(process.cwd(), 'chat_cache.sqlite');
  db = new Database.default(dbPath);
=======
  const DB_PATH = path.resolve(process.cwd(), 'chat_cache_v2.sqlite');
  db = new Database.default(DB_PATH, { timeout: 10000 }); // Increase timeout to avoid lock contention.
>>>>>>> 75f13df (Implement sequential User IDs, Smart Caching, and data cleanup tools)

  // Initialize table (v2 with userId, v3 with images)
  db.exec(`
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
    )
  `);

  // Add columns if they don't exist (Migration for v3)
  try {
    db.exec('ALTER TABLE user_chats ADD COLUMN base64Image TEXT');
    db.exec('ALTER TABLE user_chats ADD COLUMN imageHash TEXT');
  } catch (e) {
    // Columns likely exist, ignore
  }

  // Initialize Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
<<<<<<< HEAD
=======
      publicId TEXT,
>>>>>>> 75f13df (Implement sequential User IDs, Smart Caching, and data cleanup tools)
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      isVerified INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
<<<<<<< HEAD
=======

  // Add publicId column if it doesn't exist (Migration)
  try {
    db.exec('ALTER TABLE users ADD COLUMN publicId TEXT');
  } catch (e) {
    // Column likely exists
  }
>>>>>>> 75f13df (Implement sequential User IDs, Smart Caching, and data cleanup tools)
  sqliteAvailable = true;
} catch (e) {
  console.warn('SQLite not available (likely Serverless/Vercel). Using dummy implementation.');
  sqliteAvailable = false;
}

export interface ChatData {
  userId?: string;
  text: string;
  label: string;
  score: number;
  reason: string;
  factCheck?: any;
  base64Image?: string;
  imageHash?: string;
  createdAt?: string;
  _id?: string;
}

export const saveToSQLite = (id: string, data: ChatData) => {
  if (!sqliteAvailable) return;
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO user_chats (id, userId, text, label, score, reason, factCheck, base64Image, imageHash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      data.userId || 'guest',
      data.text,
      data.label,
      data.score,
      data.reason,
      JSON.stringify(data.factCheck),
      data.base64Image || null,
      data.imageHash || null
    );
  } catch (e) {
    console.error('SQLite Save Failed:', e);
  }
};

export const findInSQLite = (text: string) => {
  if (!sqliteAvailable) return null;
  try {
    const stmt = db.prepare('SELECT * FROM user_chats WHERE text = ?');
    const chat = stmt.get(text) as any;
    if (chat) {
      chat.factCheck = chat.factCheck ? JSON.parse(chat.factCheck) : null;
      chat._id = chat.id;
    }
    return chat;
  } catch (e) {
    return null;
  }
};

export const getHistoryFromSQLite = (userId: string) => {
  if (!sqliteAvailable) return [];
  try {
    const stmt = db.prepare('SELECT * FROM user_chats WHERE userId = ? ORDER BY createdAt DESC LIMIT 50');
    const chats = stmt.all(userId) as any[];
    return chats.map(chat => ({
      ...chat,
      _id: chat.id,
      factCheck: chat.factCheck ? JSON.parse(chat.factCheck) : null
    }));
  } catch (e) {
    return [];
  }
};

export const getFactCache = (query: string) => {
  if (!sqliteAvailable) return null;
  try {
    const stmt = db.prepare('SELECT * FROM fact_cache WHERE query = ?');
    const result = stmt.get(query.toLowerCase().trim()) as any;
    if (result) {
      return JSON.parse(result.data);
    }
  } catch (e) { }
  return null;
};

export const saveFactCache = (query: string, data: any) => {
  if (!sqliteAvailable) return;
  try {
    const stmt = db.prepare('INSERT OR REPLACE INTO fact_cache (query, data) VALUES (?, ?)');
    stmt.run(query.toLowerCase().trim(), JSON.stringify(data));
  } catch (e) { }
};

export interface UserData {
  id: string;
  publicId?: string; // Optional for backward compatibility but should be present
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
}

export const saveUserToSQLite = (user: UserData) => {
  if (!sqliteAvailable) return;
  try {
    const stmt = db.prepare(`
<<<<<<< HEAD
      INSERT OR REPLACE INTO users (id, username, email, password, isVerified)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(
      user.id,
=======
      INSERT OR REPLACE INTO users (id, publicId, username, email, password, isVerified)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      user.id,
      user.publicId || null,
>>>>>>> 75f13df (Implement sequential User IDs, Smart Caching, and data cleanup tools)
      user.username,
      user.email,
      user.password,
      user.isVerified ? 1 : 0
    );
  } catch (e) { }
};

export const findUserInSQLite = (email: string) => {
  if (!sqliteAvailable) return null;
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as any;
    if (user) {
      return {
        ...user,
        _id: user.id,
<<<<<<< HEAD
=======
        // publicId is already in user object
>>>>>>> 75f13df (Implement sequential User IDs, Smart Caching, and data cleanup tools)
        isVerified: user.isVerified === 1
      };
    }
  } catch (e) { }
  return null;
};

export const deleteFromSQLite = (id: string) => {
  if (!sqliteAvailable) return;
  try {
    const stmt = db.prepare('DELETE FROM user_chats WHERE id = ?');
    return stmt.run(id);
  } catch (e) { }
};

export default db;
