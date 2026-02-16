
import axios from 'axios';
import mongoose from 'mongoose';
import Chat from '../src/models/Chat';
import 'dotenv/config';
import dns from 'dns';

// DNS Workaround
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) { }

const API_URL = 'http://localhost:3001/api';
// We need a valid token or user simulation. 
// Since we can't easily login via script without simulating the wholeauth flow (and OTP),
// we might need to rely on the "guest" fallback or a temporary token if available.
// However, the API has a fallback: userId = 'guest-user-123' if no token. We'll use that.

async function testSmartCache() {
    console.log('--- Testing Smart Caching ---');

    // 1. Setup Data in MongoDB directly (to bypass API logic if needed, but API is better)
    // Actually, let's use the API to create data if possible, or direct DB insert.
    // Direct Insert is safer for controlling the "Label".

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI not found.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const userId = 'guest-user-123';
        const trueQuery = 'Is the sky blue?';
        const falseQuery = 'Is the earth flat?';

        // Clean up previous tests
        await Chat.deleteMany({ text: { $in: [trueQuery, falseQuery] }, userId });

        // Insert TRUE record
        await Chat.create({
            text: trueQuery,
            userId,
            label: 'TRUE',
            score: 100,
            reason: 'Science',
            factCheck: { rating: 'True' }
        });

        // Insert FALSE record
        await Chat.create({
            text: falseQuery,
            userId,
            label: 'FALSE',
            score: 0,
            reason: 'Science',
            factCheck: { rating: 'False' }
        });

        console.log('✅ Setup: Inserted TRUE and FALSE records directly into DB.');

        // 2. Test Cache Retrieval via API

        // Test TRUE (Should hit cache)
        console.log(`\nTesting TRUE Query: "${trueQuery}"`);
        try {
            const resTrue = await axios.get(`${API_URL}/chats?q=${encodeURIComponent(trueQuery)}`);
            if (resTrue.data.data) {
                console.log('✅ Result: Returned from Cache (Expected)');
                console.log('   Source:', resTrue.data.source); // Should be mongodb or sqlite
            } else {
                console.error('❌ Result: NOT Returned from Cache (Unexpected)');
            }
        } catch (e) {
            console.error('❌ Error fetching True query:', e.message);
        }

        // Test FALSE (Should MISS cache)
        console.log(`\nTesting FALSE Query: "${falseQuery}"`);
        try {
            const resFalse = await axios.get(`${API_URL}/chats?q=${encodeURIComponent(falseQuery)}`);
            if (resFalse.data.data) {
                console.error('❌ Result: Returned from Cache (Unexpected - Should remain hidden)');
                console.log('   Source:', resFalse.data.source);
            } else {
                console.log('✅ Result: Cache Miss (Expected - False results are ignored)');
            }
        } catch (e) {
            console.error('❌ Error fetching False query:', e.message);
        }

    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

testSmartCache();
