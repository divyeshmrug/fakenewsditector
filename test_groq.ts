import 'dotenv/config';
import { Groq } from 'groq-sdk';

const apiKey = process.env.VITE_AI_API_KEY;
const modelName = process.env.VITE_AI_MODEL_NAME || 'llama3-8b-8192';

console.log('Testing Groq API...');
console.log('API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING');
console.log('Model:', modelName);

if (!apiKey) {
    console.error('❌ API Key is missing');
    process.exit(1);
}

const groq = new Groq({ apiKey });

async function main() {
    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: 'Say hello' }],
            model: modelName,
        });
        console.log('✅ Success! Response:', completion.choices[0]?.message?.content);
    } catch (error: any) {
        console.error('❌ Failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

main();
