
import 'dotenv/config';
import mongoose from 'mongoose';
import Chat from '../src/models/Chat';
import dns from 'dns';

// DNS Workaround
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) { }

async function analyze() {
    console.log('--- Analyzing Chat Labels ---');

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI not found.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const chats = await Chat.find({});
        console.log(`Found ${chats.length} chats.`);

        const labels = new Set();
        const ratings = new Set();

        chats.forEach(c => {
            if (c.label) labels.add(c.label);
            if (c.factCheck && c.factCheck.rating) ratings.add(c.factCheck.rating);
        });

        console.log('\nUnique Labels:', Array.from(labels));
        console.log('Unique Ratings:', Array.from(ratings));

    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

analyze();
