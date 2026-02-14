
import db from './src/lib/sqlite';
import axios from 'axios';

const query = "ceo of tesla is elon musk";

// Data to mock as "FAQ"
const faqAnswer = {
    text: "Elon Musk is the CEO of Tesla.",
    claimant: "Manual Database Entry",
    rating: "True",
    publisher: "System Admin",
    date: new Date().toISOString(),
    url: "internal-database"
};

async function run() {
    console.log('--- Step 1: Storing FAQ in Database manually ---');
    try {
        const stmt = db.prepare('INSERT OR REPLACE INTO fact_cache (query, data) VALUES (?, ?)');
        stmt.run(query.toLowerCase().trim(), JSON.stringify(faqAnswer));
        console.log(`✅ Stored Question: "${query}" in SQLite.`);
    } catch (e: any) {
        console.error('❌ Failed to seed DB:', e.message);
        process.exit(1);
    }

    console.log('\n--- Step 2: Calling API to check if it uses Database ---');
    try {
        const res = await axios.post('http://localhost:3001/api/fact-check', { query });

        console.log(`Query Sent: "${query}"`);
        console.log(`Response Source: [${res.data.source}]`);
        console.log(`Response Rating: ${res.data.rating}`);

        if (res.data.source === 'cache-local') {
            console.log('\n✅ SUCCESS: The API used the Database (FAQ)! No external API was called.');
        } else {
            console.error('\n❌ FAILURE: The API went to: ' + res.data.source);
        }

    } catch (e: any) {
        if (e.code === 'ECONNREFUSED') {
            console.error('❌ Error: Backend Server is NOT running. Run "run_fakenews.bat" first.');
        } else {
            console.error('❌ API Error:', e.message);
        }
    }
}

run();
