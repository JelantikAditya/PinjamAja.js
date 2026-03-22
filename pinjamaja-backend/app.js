require('dotenv').config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();   // <- ini yang membuat app

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// test server
app.get("/", (req, res) => {
  res.send("PinjamAja API Running 🚀");
});

// test database
app.get("/db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});