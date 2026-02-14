
import axios from 'axios';

const SERPER_API_KEY = 'a5d4af8500b3e5bc88521a47d567f89515e84c31';
const queries = [
    "Elon Musk is the CEO of Tesla",
    "Gujarat is under India",
    "Earth is flat"
];

async function testSerper() {
    console.log("Testing Serper Endpoints...");

    for (const q of queries) {
        console.log(`\n--- Query: "${q}" ---`);

        try {
            // Test News Endpoint
            const newsRes = await axios.post('https://google.serper.dev/news', { q, gl: 'in' }, {
                headers: { 'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json' }
            });
            console.log("News Results (top 2):", newsRes.data.news?.slice(0, 2).map(n => n.title));

            // Test Web Endpoint
            const webRes = await axios.post('https://google.serper.dev/search', { q, gl: 'in' }, {
                headers: { 'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json' }
            });
            console.log("Web Results (top 2):", webRes.data.organic?.slice(0, 2).map(w => w.title));

        } catch (e) {
            console.error("Error:", e.message);
        }
    }
}

testSerper();
