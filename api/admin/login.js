import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { username, password } = req.body;

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '1d',
        });

        res.setHeader(
            'Set-Cookie',
            cookie.serialize('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 86400,
                path: '/',
            })
        );

        return res.status(200).json({ success: true });
    } else {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
}
