import 'dotenv/config';
import { sendOTP } from '../src/lib/mail';

const testEmail = async () => {
    const email = 'canvadwala@gmail.com';
    const otp = '928471'; // Example OTP

    console.log(`Sending test email to ${email}...`);
    try {
        const result = await sendOTP(email, otp);
        if (result.success) {
            console.log('✅ Email sent successfully!');
            console.log('Message ID:', result.messageId);
        } else {
            console.error('❌ Failed to send email:', result.error);
        }
    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
};

testEmail();
