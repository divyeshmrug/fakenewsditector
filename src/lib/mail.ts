import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendMail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || '"Fake News Detector" <no-reply@example.com>',
            to,
            subject,
            text,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

export const sendOTP = async (to: string, otp: string) => {
    const subject = 'Your Verification Code';
    const text = `Your verification code is: ${otp}. It expires in 10 minutes.`;
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4F46E5;">Verification Code</h2>
        <p>Please use the following OTP to verify your account:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
            ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p style="font-size: 12px; color: #666;">If you didn't request this, please ignore this email.</p>
    </div>
    `;
    return sendMail(to, subject, text, html);
};

export default transporter;
