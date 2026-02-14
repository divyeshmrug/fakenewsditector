import mongoose from 'mongoose';

const FactCheckSchema = new mongoose.Schema({
    query: { type: String, required: true, unique: true, index: true },
    text: String,
    claimant: String,
    rating: String,
    publisher: String,
    date: String,
    url: String,
    source: String, // 'google', 'ai', etc.
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.FactCheck || mongoose.model('FactCheck', FactCheckSchema);
