import cookie from 'cookie';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    res.setHeader(
        'Set-Cookie',
        cookie.serialize('auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: -1,
            path: '/',
        })
    );

    res.status(200).json({ success: true });
}
