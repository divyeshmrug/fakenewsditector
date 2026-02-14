
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/fact-check';

async function runTest() {
    console.log('🚀 Starting API Flow Test...');
    console.log('Ensure your backend server is running on port 3001!');

    // Generate a unique query to avoid previous cache hits
    const uniqueId = Math.floor(Math.random() * 100000);
    const query = `Is the earth flat? ID:${uniqueId}`;

    console.log(`\n--- Step 1: Asking New Question ---`);
    console.log(`Query: "${query}"`);

    try {
        const start1 = Date.now();
        const res1 = await axios.post(API_URL, { query });
        const duration1 = Date.now() - start1;

        console.log(`Response 1 Source: [${res1.data.source}]`);
        console.log(`Time Taken: ${duration1}ms`);

        if (res1.data.source === 'cache-local') {
            console.warn('⚠️ Unexpected: First query hit local cache? (Maybe random ID collision)');
        } else {
            console.log('✅ Correct: External API called (Google/AI).');
        }

        console.log(`\n--- Step 2: Asking SAME Question Again ---`);
        const start2 = Date.now();
        const res2 = await axios.post(API_URL, { query });
        const duration2 = Date.now() - start2;

        console.log(`Response 2 Source: [${res2.data.source}]`);
        console.log(`Time Taken: ${duration2}ms`);

        if (res2.data.source === 'cache-local' || res2.data.source === 'cache-cloud') {
            console.log('✅ Correct: Served from Cache! (External API NOT called)');
            console.log('🎉 Test Passed: FAQ Caching is working.');
        } else {
            console.error('❌ Failed: Second query did NOT hit cache. Source:', res2.data.source);
        }

    } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Error: Could not connect to API Server. Is it running?');
            console.error('Run "run_fakenews.bat" first.');
        } else {
            console.error('❌ API Error:', error.message);
        }
    }
}

runTest();
