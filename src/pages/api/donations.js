import { Client } from "pg";

export default async function handler(req, res) {
    const { slug } = req.query;

    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        console.log("Connected to the database!");

        const query = `
            SELECT 
                d.*, 
                json_agg(DISTINCT c.name) AS categories,
                json_agg(DISTINCT t.name) AS types
            FROM donations d
            LEFT JOIN donation_category dc ON d.id = dc.donation_id
            LEFT JOIN categories c ON dc.category_id = c.id
            LEFT JOIN donation_type_map dtm ON d.id = dtm.donation_id
            LEFT JOIN donation_types t ON dtm.type_id = t.id
            WHERE d.slug = $1
            GROUP BY d.id;
        `;

        const values = [slug];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({ error: "Donation not found" });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await client.end();
    }
}
