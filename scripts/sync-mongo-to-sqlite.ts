
import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'dns';
import dbConnect from '../src/lib/mongodb';
import Chat from '../src/models/Chat';
import FactCheck from '../src/models/FactCheck';
import { saveToSQLite, saveFactCache } from '../src/lib/sqlite';

// FIX: Force Google DNS
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.error('Failed to set DNS servers:', e);
}

const syncMongoToSQLite = async () => {
    console.log('🔄 Starting Sync: MongoDB -> SQLite...');

    try {
        await dbConnect();
        console.log('✅ Connected to MongoDB');

        // 1. Sync Fact Checks
        console.log('📦 Fetching Fact Checks...');
        const facts = await FactCheck.find({});
        console.log(`found ${facts.length} fact checks.`);

        let factCount = 0;
        for (const fact of facts) {
            saveFactCache(fact.query, {
                text: fact.text,
                claimant: fact.claimant,
                rating: fact.rating,
                publisher: fact.publisher,
                date: fact.date,
                url: fact.url,
                source: fact.source
            });
            factCount++;
        }
        console.log(`✅ Synced ${factCount} fact checks to SQLite.`);

        // 2. Sync Chat History
        console.log('💬 Fetching Chat History...');
        const chats = await Chat.find({});
        console.log(`found ${chats.length} chat records.`);

        let chatCount = 0;
        for (const chat of chats) {
            saveToSQLite(chat._id.toString(), {
                userId: chat.userId,
                text: chat.text,
                label: chat.label,
                score: chat.score,
                reason: chat.reason,
                factCheck: chat.factCheck,
                base64Image: chat.base64Image, // Sync Image
                imageHash: chat.imageHash,     // Sync Hash
                createdAt: chat.createdAt.toISOString(),
                _id: chat._id.toString()
            });
            chatCount++;
        }
        console.log(`✅ Synced ${chatCount} chat records to SQLite.`);

        console.log('\n🎉 Full Sync Complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Sync Failed:', error);
        process.exit(1);
    }
};

syncMongoToSQLite();
