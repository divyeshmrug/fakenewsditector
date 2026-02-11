import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
    text: string;
    label: string;
    score: number;
    reason: string;
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
    label: { type: String, required: true },
    score: { type: Number, required: true },
    reason: { type: String, required: true },
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
