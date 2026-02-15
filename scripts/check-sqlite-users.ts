import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'chat_cache.sqlite');
console.log('Checking SQLite DB at:', dbPath);

const db = new Database(dbPath, { readonly: true });

try {
    const users = db.prepare('SELECT email, username, isVerified FROM users').all();
    console.log(`\nFound ${users.length} users in SQLite:`);
    users.forEach((u: any) => {
        console.log(`- ${u.email} (${u.username}) [Verified: ${u.isVerified}]`);
    });
} catch (error: any) {
    console.error('Error reading users:', error.message);
} finally {
    db.close();
}
