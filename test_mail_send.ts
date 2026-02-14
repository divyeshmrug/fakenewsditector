import 'dotenv/config';
import { sendMail } from './src/lib/mail';

const toEmail = process.env.MAIL_USER || 'test@example.com';

console.log(`Sending test email to ${toEmail}...`);

async function run() {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.error('❌ ERROR: Please set MAIL_USER and MAIL_PASS in .env first!');
        return;
    }

    const result = await sendMail(toEmail, 'Test Email from Fake News App', 'This is a test email to verify nodemailer configuration.');

    if (result.success) {
        console.log('✅ Email sent successfully!', result.messageId);
    } else {
        console.error('❌ Failed to send email.', result.error);
    }
}

run();
