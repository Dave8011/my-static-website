import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.auth_token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
        const response = await fetch(scriptUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch from Google Script');
        }

        let data = await response.json();

        if (Array.isArray(data)) {
            data = { appointments: data };
        } else if (!data.appointments) {
            data.appointments = [];
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
