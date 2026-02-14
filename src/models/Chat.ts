import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
    text: string;
    base64Image?: string;  // Store image data for caching
    imageHash?: string;     // MD5 hash for quick duplicate detection
    label: string;
    score: number;
    reason: string;
    userId: string;
    factCheck?: {
        found: boolean;
        text: string;
        rating: string;
        publisher: string;
        url: string;
    };
    createdAt: Date;
}

const ChatSchema: Schema = new Schema({
    text: { type: String, required: true },
    base64Image: { type: String },  // Store base64 encoded image
    imageHash: { type: String, index: true },  // MD5 hash for fast lookup
    label: { type: String, required: true },
    score: { type: Number, required: true },
    reason: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    factCheck: {
        found: { type: Boolean, default: false },
        text: { type: String },
        rating: { type: String },
        publisher: { type: String },
        url: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
