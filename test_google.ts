import 'dotenv/config';
import axios from 'axios';

const apiKey = process.env.VITE_CHECK_API_KEY;
console.log('Testing Google Fact Check API...');
console.log('API Key:', apiKey ? apiKey.substring(0, 5) + '...' : 'MISSING');

if (!apiKey) process.exit(1);

async function testGoogle() {
    try {
        const response = await axios.get('https://factchecktools.googleapis.com/v1alpha1/claims:search', {
            params: {
                key: apiKey,
                query: "earth is flat",
                languageCode: 'en-US'
            }
        });
        console.log('✅ Google Success:', response.data.claims?.[0]?.text || 'No claims found but success');
    } catch (error: any) {
        console.error('❌ Google Failed:', error.response?.data?.error?.message || error.message);
    }
}

testGoogle();
