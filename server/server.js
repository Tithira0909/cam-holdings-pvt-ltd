require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/api/health", async (req, res) => {
  const [rows] = await pool.query("SELECT 1 as ok");
  res.json({ ok: true, db: rows[0].ok });
});

// get all properties
app.get("/api/properties", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM properties ORDER BY id DESC");
  res.json(rows);
});

// create property
app.post("/api/properties", async (req, res) => {
  const { title, slug, location, type, price, status, description, main_image } = req.body;
  const [result] = await pool.query(
    `INSERT INTO properties (title, slug, location, type, price, status, description, main_image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, location, type, price, status, description, main_image]
  );
  res.json({ id: result.insertId });
});

app.listen(process.env.PORT, () => console.log("API running on", process.env.PORT));
