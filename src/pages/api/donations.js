import { Client } from 'pg';

export default async function handler(req, res) {
    const { slug } = req.query;

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // Log environment variables to check if they are correctly loaded
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PORT:', process.env.DB_PORT);

    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false, // Required for Render
        },
    });   

    try {
        await client.connect();

        // Fetch the donation record
        const donationQuery = `
            SELECT *
            FROM donations
            WHERE slug = $1
        `;
        const donationValues = [slug];
        const donationResult = await client.query(donationQuery, donationValues);

        if (donationResult.rows.length === 0) {
            res.status(404).json({ error: 'Donation not found' });
            return;
        }

        const donation = donationResult.rows[0];

        // Fetch the categories for this donation
        const categoriesQuery = `
            SELECT c.name
            FROM donation_category dc
            JOIN categories c ON dc.category_id = c.id
            WHERE dc.donation_id = $1
        `;
        const categoriesResult = await client.query(categoriesQuery, [donation.id]);
        const categories = categoriesResult.rows.map((row) => row.name);

        // Fetch the types for this donation
        const typesQuery = `
            SELECT dt.name
            FROM donation_type_map dtm
            JOIN donation_types dt ON dtm.type_id = dt.id
            WHERE dtm.donation_id = $1
        `;
        const typesResult = await client.query(typesQuery, [donation.id]);
        const types = typesResult.rows.map((row) => row.name);

        // Add categories and types to the donation object
        donation.categories = categories;
        donation.types = types;

        // Send the response
        res.status(200).json(donation);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.end();
    }
}
