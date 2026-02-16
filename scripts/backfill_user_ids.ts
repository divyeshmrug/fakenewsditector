
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User';
import dns from 'dns';

// DNS Workaround for MongoDB Atlas
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('Using Google DNS for MongoDB connection');
} catch (e) {
    console.error('Failed to set DNS servers:', e);
}

const generatePublicId = () => `axiant_intelligence_${Math.floor(100000 + Math.random() * 900000)}`;

async function backfill() {
    console.log('--- Backfilling Missing User IDs ---');

    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI not found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find users without publicId
        const users = await User.find({
            $or: [
                { publicId: { $exists: false } },
                { publicId: null },
                { publicId: "" }
            ]
        });

        console.log(`Found ${users.length} users needing ID update.`);

        for (const user of users) {
            const newId = generatePublicId();
            // Ensure uniqueness simply
            let exists = await User.findOne({ publicId: newId });
            if (exists) {
                // Retry once
                user.publicId = generatePublicId();
            } else {
                user.publicId = newId;
            }

            await user.save();
            console.log(`🔹 Updated user: ${user.email} -> ${user.publicId}`);
        }

        console.log('✅ Backfill Complete!');

    } catch (e: any) {
        console.error('❌ Error:', e);
    } finally {
        await mongoose.disconnect();
    }
}

backfill();
