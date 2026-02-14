import dotenv from 'dotenv';
dotenv.config();

const runTest = async () => {
    // Dynamic import to ensure env vars are loaded first
    const { sendWelcomeEmail, sendPasswordResetEmail } = await import('../src/lib/mail');

    // Check if mail env vars are present
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.error('❌ MAIL_USER or MAIL_PASS missing in .env');
        process.exit(1);
    }

    const testEmail = process.env.MAIL_USER; // Send to self for testing
    console.log(`Debug ENV: USER=${testEmail ? 'Set' : 'Unset'}, PASS=${process.env.MAIL_PASS ? 'Set' : 'Unset'}`);
    console.log(`📧 Sending Test Emails to: ${testEmail}`);

    console.log('1️⃣ Sending Welcome Email...');
    const welcomeResult = await sendWelcomeEmail(testEmail, 'Test User');
    console.log('Welcome Email Result:', welcomeResult);

    console.log('2️⃣ Sending Password Reset Email...');
    const resetResult = await sendPasswordResetEmail(testEmail, '987654');
    console.log('Reset Email Result:', resetResult);

    console.log('3️⃣ Sending OTP Email (Verification)...');
    // We need to dynamically import sendOTP as well
    const { sendOTP } = await import('../src/lib/mail');
    const otpResult = await sendOTP(testEmail, '123456');
    console.log('OTP Email Result:', otpResult);

    console.log('✅ Done!');
};

runTest();
