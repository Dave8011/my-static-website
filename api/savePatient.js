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
