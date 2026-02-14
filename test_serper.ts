import 'dotenv/config';
import axios from 'axios';

const apiKey = process.env.VITE_SEARCH_API_KEY;
console.log('Testing Serper API...');
console.log('API Key:', apiKey ? apiKey.substring(0, 5) + '...' : 'MISSING');

if (!apiKey) process.exit(1);

async function testSerper() {
    try {
        const response = await axios.post('https://google.serper.dev/search', {
            q: "Elon Musk",
            num: 1
        }, {
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Serper Success:', response.data.organic?.[0]?.title || 'No results but success');
    } catch (error: any) {
        console.error('❌ Serper Failed:', error.response?.data || error.message);
    }
}

testSerper();
