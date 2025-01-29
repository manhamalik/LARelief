const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // The connection string from your .env file
    ssl: {
        rejectUnauthorized: false, // Required for Render-hosted databases
    },
});

// Export the query function for use in API routes
module.exports = {
    query: (text, params) => pool.query(text, params),
};
