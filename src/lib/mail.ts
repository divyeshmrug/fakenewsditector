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
    console.log('Using UPDATED sendOTP function from src/lib/mail.ts');
    const subject = `🔐 Verify Your Axiant Account [${new Date().toISOString()}]`;
    const text = `Your verification code is: ${otp}. It expires in 10 minutes.`;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Axiant Verification</title>
    </head>
    <body style="margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #0f172a; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        <!-- Hidden Preheader -->
        <div style="display: none; max-height: 0; overflow: hidden;">
            Your verification code: ${otp}
        </div>
        
        <!-- WRAPPER with Legacy BGCOLOR -->
        <div style="background-color: #0f172a; width: 100%; height: 100%;">
            <!--[if mso]>
            <table align="center" border="0" cellspacing="0" cellpadding="0" width="100%" bgcolor="#0f172a">
            <tr>
            <td align="center" valign="top">
            <![endif]-->
            
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#0f172a" style="background-color: #0f172a; width: 100%; margin: 0; padding: 0;">
                <tr>
                    <td align="center" valign="top" style="background-color: #0f172a; padding: 40px 0;">
                        
                        <!-- MAIN CARD without Border/Shadow for cleanliness -->
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#1e293b" style="max-width: 600px; background-color: #1e293b; border-radius: 24px; overflow: hidden; margin: 0 auto;">
                            
                            <!-- Header -->
                            <tr>
                                <td align="center" style="padding: 40px 0 30px 0; background-color: #0f172a; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
                                    <table cellspacing="0" cellpadding="0" border="0">
                                        <tr>
                                            <td>
                                                <div style="width: 60px; height: 60px; background-color: #10b981; background: linear-gradient(135deg, #22c55e 0%, #10b981 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                                    <span style="font-size: 32px; color: #ffffff !important; display: block; text-align: center; line-height: 60px;">⚡</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <h1 style="margin: 20px 0 0 0; font-size: 28px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #4ade80 !important; font-family: sans-serif; mso-line-height-rule: exactly;">
                                        AXIANT <span style="color: #4ade80;">IQ</span>
                                    </h1>
                                    <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: #94a3b8; font-weight: 700;">Authenticity Engine</p>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding: 40px; background-color: #1e293b;">
                                    <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 700; color: #ffffff !important; text-align: center;">Verify Your Identity 🛡️</h2>
                                    <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #cbd5e1; text-align: center;">
                                        Welcome to the secure network. Use the code below to complete your authentication process. This code is valid for <strong>10 minutes</strong>.
                                    </p>

                                    <!-- OTP -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                        <tr>
                                            <td align="center">
                                                <div style="background-color: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.2); border-radius: 16px; padding: 20px 40px; display: inline-block;">
                                                    <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #4ade80; display: block;">${otp}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Warning -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 30px;">
                                        <tr>
                                            <td style="background-color: #334155; border-radius: 12px; padding: 15px;">
                                                <p style="margin: 0; font-size: 13px; color: #cbd5e1; text-align: center;">
                                                    ⚠️ If you did not request this verification, please secure your account immediately or ignore this message.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #0f172a; padding: 30px; text-align: center;">
                                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Axiant Intelligence Systems</p>
                                    <p style="margin: 0; font-size: 12px; color: #475569;">
                                        &copy; ${new Date().getFullYear()} Secure Division. All rights reserved.
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
    return sendMail(to, subject, text, html);
};

export default transporter;
