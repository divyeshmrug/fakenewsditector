import 'dotenv/config';
import { sendOTP } from './src/lib/mail';

const toEmail = process.env.MAIL_USER || 'test@example.com';
const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

console.log(`Sending OTP ${otp} to ${toEmail}...`);

async function run() {
    const result = await sendOTP(toEmail, otp);

    if (result.success) {
        console.log('✅ OTP Email sent successfully!', result.messageId);
    } else {
        console.error('❌ Failed to send OTP email.', result.error);
    }
}

run();
