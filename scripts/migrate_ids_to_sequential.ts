
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User';
import Counter from '../src/models/Counter';
import dns from 'dns';

// DNS Workaround
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) { }

async function migrate() {
    console.log('--- Migrating to Sequential IDs ---');

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI not found.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Fetch all users sorted by createdAt
        const users = await User.find({}).sort({ createdAt: 1 });
        console.log(`Found ${users.length} users.`);

        // 2. Re-assign IDs
        let seq = 0;
        for (const user of users) {
            seq++;
            const seqStr = seq.toString().padStart(6, '0');
            const newId = `axiant_intelligence_${seqStr}`;

            console.log(`🔹 ${user.email}: ${user.publicId} -> ${newId}`);
            user.publicId = newId;
            await user.save();
        }

        // 3. Update Counter
        await Counter.findByIdAndUpdate(
            'userId',
            { seq: seq },
            { upsert: true, new: true }
        );
        console.log(`✅ Counter updated to ${seq}`);
        console.log('🎉 Migration Complete!');

    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
