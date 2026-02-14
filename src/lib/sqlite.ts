import Database from 'better-sqlite3';
import path from 'path';

// Note: SQLite is ephemeral on Vercel, but we use it as requested by the user.
// MongoDB remains the primary source of truth for the cross-session cache.

const dbPath = path.resolve(process.cwd(), 'chat_cache.sqlite');
const db = new Database(dbPath);

// Initialize table (v2 with userId)
db.exec(`
  CREATE TABLE IF NOT EXISTS user_chats (
    id TEXT PRIMARY KEY,
    userId TEXT,
    text TEXT NOT NULL,
    label TEXT NOT NULL,
    score INTEGER NOT NULL,
    reason TEXT NOT NULL,
    factCheck TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Initialize Fact Cache Table (For FAQs/High Frequency Queries)
db.exec(`
  CREATE TABLE IF NOT EXISTS fact_cache (
    query TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface ChatData {
  userId?: string; // Added userId
  text: string;
  label: string;
  score: number;
  reason: string;
  factCheck?: any;
  createdAt?: string; // Added for retrieval
  _id?: string; // Mapped from id
}

export const saveToSQLite = (id: string, data: ChatData) => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO user_chats (id, userId, text, label, score, reason, factCheck)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, data.userId || 'guest', data.text, data.label, data.score, data.reason, JSON.stringify(data.factCheck));
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

export default db;
