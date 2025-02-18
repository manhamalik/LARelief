const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/resources", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        r.id, r.name, r.address, r.about, r.details, 
        r.longitude, r.latitude, r.organization_image, r.carousel_images,
        json_agg(c.name) AS categories,
        json_agg(t.name) AS types
      FROM resources r
      LEFT JOIN resource_category rc ON r.id = rc.resource_id
      LEFT JOIN categories c ON rc.category_id = c.id
      LEFT JOIN resource_type_map rtm ON r.id = rtm.resource_id
      LEFT JOIN resource_types t ON rtm.type_id = t.id
      GROUP BY r.id;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
