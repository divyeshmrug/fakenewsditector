
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import path from 'path';
import handler from './api/fact-check';

dotenv.config();

// 1. Setup Mock Request/Response
const req = {
    method: 'GET',
    body: { query: 'Why is the sky blue check?' }, // Using body as per your API implementation
    query: { query: 'Why is the sky blue check?' } // Fallback if you change to GET query params
};

const res = {
    statusCode: 200,
    setHeader: () => { },
    status: function (code) {
        this.statusCode = code;
        return this;
    },
    json: function (data) {
        console.log('---------------------------------------------------');
        console.log('API RESPONSE:');
        console.log(JSON.stringify(data, null, 2));
        console.log('---------------------------------------------------');
        if (data.source === 'cache-local') {
            console.log('✅ SUCCESS: Answer came from Local SQLite Cache!');
        } else {
            console.log(`❌ FAILURE: Answer came from ${data.source}`);
        }
    },
    end: () => { }
};

// 2. Insert Fake "Manual" Data into SQLite
const dbPath = path.resolve(process.cwd(), 'chat_cache.sqlite');
const db = new Database(dbPath);

const TEST_QUERY = 'Why is the sky blue check?';
const TEST_ANSWER = {
    text: 'Because existing manual entry says so.',
    claimant: 'Manual Tester',
    rating: 'True',
    publisher: 'Local DB',
    date: '2024-01-01',
    url: 'http://localhost'
};

console.log(`\n1️⃣  Manually inserting FAQ into '${dbPath}'...`);
console.log(`   Query: "${TEST_QUERY}"`);

const stmt = db.prepare('INSERT OR REPLACE INTO fact_cache (query, data) VALUES (?, ?)');
stmt.run(TEST_QUERY.toLowerCase().trim(), JSON.stringify(TEST_ANSWER)); // Normalize as API does

console.log('2️⃣  Running API Handler (Simulated)...');

// 3. Run Handler
// The handler is async, so we await it
(async () => {
    try {
        await handler(req as any, res as any);
    } catch (e) {
        console.error('Handler Error:', e);
    }
})();
