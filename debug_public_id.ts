
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'chat_cache_v2.sqlite');
console.log(`Checking DB: ${dbPath}`);

try {
    const db = new Database(dbPath, { readonly: true });

    // 1. Check Table Info
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    console.log('\n--- Table Schema: users ---');
    console.table(tableInfo);

    // 2. Check Data
    const users = db.prepare("SELECT id, username, email, publicId FROM users").all();
    console.log('\n--- User Data ---');
    console.table(users);

} catch (e) {
    console.error('Error:', e);
}
