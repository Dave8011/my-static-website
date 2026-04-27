export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    let bodyParams;
    if (typeof req.body === 'string') {
        try {
            bodyParams = JSON.parse(req.body);
        } catch (e) {
            bodyParams = {};
        }
    } else {
        bodyParams = req.body || {};
    }

    if (!bodyParams.name || !bodyParams.contact || !bodyParams.service) {
        return res.status(400).json({ error: 'Missing required fields. Name, Contact, and Service are mandatory.' });
    }

    // Indian phone number regex: optional +91 or 91, optional space/dash, then 10 digits
    const phoneRegex = /^(?:\+?91[-\s]?)?[0-9]{10}$/;
    if (!phoneRegex.test(bodyParams.contact.trim())) {
        return res.status(400).json({ error: 'Invalid phone number. Must be a valid 10-digit Indian number (e.g. +91 9876543210).' });
    }

    try {
        const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({
                key: process.env.REHAB_SECRET,
                name: bodyParams.name,
                service: bodyParams.service,
                contact: bodyParams.contact,
                location: bodyParams.location,
                issue: bodyParams.issue,
            }),
        });

        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        console.error('Save Patient Error:', error);
        res.status(500).json({ success: false });
    }
}
