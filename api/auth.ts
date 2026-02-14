
import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import User from '../src/models/User';
import { saveUserToSQLite } from '../src/lib/sqlite';
import { sendOTP, sendMail, sendWelcomeEmail, sendPasswordResetEmail } from '../src/lib/mail';
import dbConnect from '../src/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const signup = async (req: Request, res: Response) => {
    await dbConnect();
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const hashedPassword = await argon2.hash(password);
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
            isVerified: false
        });

        // Dual-Write to SQLite
        try {
            saveUserToSQLite({
                id: newUser._id.toString(),
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                isVerified: false
            });
        } catch (sqliteError) {
            console.error('SQLite Backup Failed:', sqliteError);
        }

        // Send OTP Email
        await sendOTP(email, otp);

        res.status(201).json({ success: true, message: 'User created. Please verify your email.', userId: newUser._id });
    } catch (error: any) {
        console.error('Signup Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const verify = async (req: Request, res: Response) => {
    await dbConnect();
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.isVerified) return res.status(400).json({ success: false, message: 'User already verified' });

        if (user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Dual-Write to SQLite
        try {
            saveUserToSQLite({
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                password: user.password,
                isVerified: true
            });
        } catch (sqliteError) {
            console.error('SQLite Backup Failed:', sqliteError);
        }

        // Send Welcome Email
        await sendWelcomeEmail(user.email, user.username);

        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {
    await dbConnect();
    const { email, password } = req.body;
    console.log(`[Auth] Login attempt for: ${email}`);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`[Auth] User not found: ${email}`);
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) {
            console.log(`[Auth] Invalid password for: ${email}`);
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            console.log(`[Auth] User not verified: ${email}`);
            return res.status(403).json({ success: false, message: 'Email not verified. Please verify your account.' });
        }

        const token = jwt.sign({ userId: user._id, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    await dbConnect();
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const otp = generateOTP();
        user.resetToken = otp; // Reusing OTP logic for simplicity here, allows same Verify page usage or similar
        user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendPasswordResetEmail(email, otp);

        res.json({ success: true, message: 'Password reset OTP sent to email' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    await dbConnect();
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.resetToken !== otp || (user.resetTokenExpires && user.resetTokenExpires < new Date())) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.password = await argon2.hash(newPassword);
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

        // Dual-Write to SQLite
        try {
            saveUserToSQLite({
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                password: user.password,
                isVerified: user.isVerified // Should be true if they are resetting password
            });
        } catch (sqliteError) {
            console.error('SQLite Backup Failed:', sqliteError);
        }

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
