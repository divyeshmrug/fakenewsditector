import Database from 'better-sqlite3';
import path from 'path';

// Note: SQLite is ephemeral on Vercel, but we use it as requested by the user.
// MongoDB remains the primary source of truth for the cross-session cache.

const dbPath = path.resolve(process.cwd(), 'chat_cache.sqlite');
const db = new Database(dbPath);

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
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    isVerified INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ... Fact Cache Table ...

export interface ChatData {
  userId?: string;
  text: string;
  label: string;
  score: number;
  reason: string;
  factCheck?: any;
  base64Image?: string; // Added
  imageHash?: string;   // Added
  createdAt?: string;
  _id?: string;
}

export const saveToSQLite = (id: string, data: ChatData) => {
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
};

export const findInSQLite = (text: string) => {
  const stmt = db.prepare('SELECT * FROM user_chats WHERE text = ?');
  const chat = stmt.get(text) as any;
  if (chat) {
    chat.factCheck = chat.factCheck ? JSON.parse(chat.factCheck) : null;
    chat._id = chat.id; // Map for frontend compatibility
  }
  return chat;
};

export const getHistoryFromSQLite = (userId: string) => {
  const stmt = db.prepare('SELECT * FROM user_chats WHERE userId = ? ORDER BY createdAt DESC LIMIT 50');
  const chats = stmt.all(userId) as any[];
  return chats.map(chat => ({
    ...chat,
    _id: chat.id,
    factCheck: chat.factCheck ? JSON.parse(chat.factCheck) : null
  }));
};

// --- Fact Cache Functions ---

export const getFactCache = (query: string) => {
  const stmt = db.prepare('SELECT * FROM fact_cache WHERE query = ?');
  const result = stmt.get(query.toLowerCase().trim()) as any;
  if (result) {
    return JSON.parse(result.data);
  }
  return null;
};

export const saveFactCache = (query: string, data: any) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO fact_cache (query, data) VALUES (?, ?)');
  stmt.run(query.toLowerCase().trim(), JSON.stringify(data));
};

// --- User Functions ---

export interface UserData {
  id: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
}

export const saveUserToSQLite = (user: UserData) => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO users (id, username, email, password, isVerified)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(
    user.id,
    user.username,
    user.email,
    user.password,
    user.isVerified ? 1 : 0
  );
};

export default db;
