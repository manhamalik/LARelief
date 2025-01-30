import { Client } from "pg";

export default async function handler(req, res) {
    // Log environment variables to verify they're loaded
    console.log('Environment Variables:', {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
    });

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
        ssl: {
            rejectUnauthorized: false, // Required for Render-hosted databases
        },
    });

    try {
        console.log("Connecting to the database...");
        await client.connect();
        console.log("Database connected successfully");

        const query = `
            SELECT r.*, 
                    COALESCE(json_agg(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL), '[]') AS categories,
                    COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS types,
                    r.accessibility
            FROM resources r
            LEFT JOIN resource_category rc ON r.id = rc.resource_id
            LEFT JOIN categories c ON rc.category_id = c.id
            LEFT JOIN resource_type_map rt ON r.id = rt.resource_id
            LEFT JOIN resource_types t ON rt.type_id = t.id
            WHERE r.slug = $1
            GROUP BY r.id
        `;

        const values = [slug];
        console.log("Executing query:", query, "with values:", values);

        const result = await client.query(query, values);
        console.log("Query executed successfully. Result:", result.rows);

        if (result.rows.length === 0) {
            console.log("Resource not found for slug:", slug);
            res.status(404).json({ error: "Resource not found" });
        } else {
            console.log("Resource found:", result.rows[0]);
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error("Database query error:", error.message);
        res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    } finally {
        console.log("Closing database connection...");
        await client.end();
        console.log("Database connection closed.");
    }
}
