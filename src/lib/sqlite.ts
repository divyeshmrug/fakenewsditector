import Database from 'better-sqlite3';
import path from 'path';

// Note: SQLite is ephemeral on Vercel, but we use it as requested by the user.
// MongoDB remains the primary source of truth for the cross-session cache.

const dbPath = path.resolve(process.cwd(), 'chat_cache.sqlite');
const db = new Database(dbPath);

// Initialize table
db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    label TEXT NOT NULL,
    score INTEGER NOT NULL,
    reason TEXT NOT NULL,
    userId TEXT NOT NULL,
    factCheck TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface ChatData {
  text: string;
  label: string;
  score: number;
  reason: string;
  userId: string;
  factCheck?: any;
}

export const saveToSQLite = (id: string, data: ChatData) => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO chats (id, text, label, score, reason, userId, factCheck)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, data.text, data.label, data.score, data.reason, data.userId, JSON.stringify(data.factCheck));
};

export const findInSQLite = (text: string) => {
  const stmt = db.prepare('SELECT * FROM chats WHERE text = ?');
  const chat = stmt.get(text) as any;
  if (chat) {
    chat.factCheck = chat.factCheck ? JSON.parse(chat.factCheck) : null;
  }
  return chat;
};

export default db;
