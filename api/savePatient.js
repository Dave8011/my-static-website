export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({
                key: process.env.REHAB_SECRET,
                name: req.body.name,
                service: req.body.service,
                contact: req.body.contact,
                location: req.body.location,
                issue: req.body.issue,
            }),
        });

        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        console.error('Save Patient Error:', error);
        res.status(500).json({ success: false });
    }
}
