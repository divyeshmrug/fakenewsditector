import { signup } from '../_auth';

export default async function handler(req: any, res: any) {
    // Vercel handles CORS if configured in vercel.json, but for safety set headers manually or rely on framework.
    // Assuming Vercel handles basics.
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    await signup(req, res);
}
