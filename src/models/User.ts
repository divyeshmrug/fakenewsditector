import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    publicId: string; // e.g., axiant_intelligence_123456
    username: string;
    email: string;
    password: string; // Hashed with Argon2
    isVerified: boolean;
    otp?: string;
    otpExpires?: Date;
    resetToken?: string;
    resetTokenExpires?: Date;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    publicId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
