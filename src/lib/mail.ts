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
    const subject = `🔐 Verify Your Axiant Account`;
    const body = `
        <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #ffffff !important; text-align: center;">Verify Your Identity 🛡️</h2>
        <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #cbd5e1; text-align: center;">
            Welcome to the secure network. Use the code below to complete your authentication process.
        </p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td align="center">
                    <div style="background-color: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.2); border-radius: 16px; padding: 20px 40px; display: inline-block;">
                        <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #4ade80; display: block; text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);">${otp}</span>
                    </div>
                </td>
            </tr>
        </table>

        <p style="margin: 30px 0 0 0; font-size: 14px; color: #94a3b8; text-align: center;">
            This code expires in <strong>10 minutes</strong>.
        </p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 30px;">
            <tr>
                <td style="background-color: #334155; border-radius: 12px; padding: 15px;">
                    <p style="margin: 0; font-size: 13px; color: #cbd5e1; text-align: center;">
                        ⚠️ If you did not request this verification, please secure your account immediately or ignore this message.
                    </p>
                </td>
            </tr>
        </table>
    `;
    return sendMail(to, subject, `Your verification code is: ${otp}`, getEmailTemplate(subject, body, '⚡'));
};

// Shared Email Template Function for consistency
const getEmailTemplate = (title: string, bodyContent: string, badge: string = '🛡️') => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
        </head>
        <body style="margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #0f172a; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
            <div style="background-color: #0f172a; width: 100%; height: 100%;">
                <!--[if mso]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" bgcolor="#0f172a">
                <tr>
                <td align="center" valign="top">
                <![endif]-->
                
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0f172a" style="background-color: #0f172a; width: 100%; margin: 0; padding: 0;">
                    <tr>
                        <td align="center" valign="top" style="background-color: #0f172a; padding: 40px 0;">
                            
                            <!-- MAIN CARD -->
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#1e293b" style="max-width: 600px; background-color: #1e293b; border-radius: 24px; overflow: hidden; margin: 0 auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
                                
                                <!-- Header with Gradient -->
                                <tr>
                                    <td align="center" style="padding: 40px 0 30px 0; background-color: #0f172a; background: linear-gradient(135deg, #0f172a 0%, #172554 100%);">
                                        <table cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td>
                                                    <!-- Logo Representation -->
                                                    <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);">
                                                        <span style="font-size: 30px; color: #ffffff !important; display: block; text-align: center; line-height: 60px;">${badge}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        <h1 style="margin: 20px 0 0 0; font-size: 26px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #22d3ee !important; font-family: 'Arial', sans-serif; mso-line-height-rule: exactly; text-shadow: 0 0 10px rgba(34, 211, 238, 0.3);">
                                            AXIANT <span style="color: #818cf8;">INTELLIGENCE</span>
                                        </h1>
                                        <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #94a3b8; font-weight: 700;">Authenticity Verification Engine</p>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding: 40px; background-color: #1e293b;">
                                        ${bodyContent}
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #334155;">
                                        <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Axiant Security Systems</p>
                                        <div style="display: flex; justify-content: center; margin-bottom: 20px; text-transform: uppercase; font-size: 10px; color: #475569; letter-spacing: 2px;">
                                            <span style="margin: 0 10px;">Secure</span> • <span style="margin: 0 10px;">Encrypted</span> • <span style="margin: 0 10px;">Verified</span>
                                        </div>
                                        <p style="margin: 0; font-size: 11px; color: #475569;">
                                            &copy; ${new Date().getFullYear()} Axiant Intelligence. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            <!-- END CARD -->

                        </td>
                    </tr>
                </table>
                
                <!--[if mso]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </div>
        </body>
        </html>
        `;
};

export const sendWelcomeEmail = async (to: string, username: string) => {
    const subject = `🚀 Welcome to the Future, ${username}!`;
    const body = `
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #ffffff !important; text-align: center;">Verified & Activated ✅</h2>
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #cbd5e1; text-align: center;">
                Hi <strong>${username}</strong>, welcome to <strong>Axiant Intelligence</strong>.
            </p>
            <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 1.6; color: #94a3b8; text-align: center;">
                Your account has been successfully created and verified. You now have full access to our state-of-the-art <strong>Deepfake Detection</strong> and <strong>Fact-Checking</strong> tools.
            </p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td align="center">
                        <a href="http://localhost:5173/dashboard" style="background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: inline-block; box-shadow: 0 10px 20px -10px rgba(6, 182, 212, 0.5);">
                            Launch Dashboard 🚀
                        </a>
                    </td>
                </tr>
            </table>

            <div style="margin-top: 40px; padding: 20px; background-color: #334155; border-radius: 12px; border-left: 4px solid #22d3ee;">
                <p style="margin: 0; font-size: 13px; color: #e2e8f0; font-style: italic;">
                    "Truth is the ultimate currency in the digital age."
                </p>
            </div>
        `;
    return sendMail(to, subject, "Welcome to Axiant Intelligence", getEmailTemplate(subject, body, 'A'));
};

export const sendPasswordResetEmail = async (to: string, otp: string) => {
    const subject = `🔑 Reset Your Password`;
    const body = `
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #ffffff !important; text-align: center;">Password Reset Request</h2>
            <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #cbd5e1; text-align: center;">
                We received a request to reset your password. Use the secure OTP below to proceed.
            </p>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <td align="center">
                        <div style="background-color: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 16px; padding: 20px 40px; display: inline-block;">
                            <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #22d3ee; display: block; text-shadow: 0 0 20px rgba(34, 211, 238, 0.5);">${otp}</span>
                        </div>
                    </td>
                </tr>
            </table>

            <p style="margin: 30px 0 0 0; font-size: 14px; color: #94a3b8; text-align: center;">
                This code expires in <strong>10 minutes</strong>.
            </p>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 30px;">
                <tr>
                    <td style="background-color: #334155; border-radius: 12px; padding: 15px;">
                        <p style="margin: 0; font-size: 13px; color: #cbd5e1; text-align: center;">
                            ⚠️ If you did not request this, you can safely ignore this email.
                        </p>
                    </td>
                </tr>
            </table>
        `;
    return sendMail(to, subject, `Your reset code is ${otp}`, getEmailTemplate(subject, body, '🔑'));
};

export default transporter;
