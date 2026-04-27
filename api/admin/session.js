import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.auth_token;

    if (!token) {
        return res.status(401).json({ authenticated: false });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        return res.status(200).json({ authenticated: true });
    } catch (error) {
        return res.status(401).json({ authenticated: false });
    }
}
