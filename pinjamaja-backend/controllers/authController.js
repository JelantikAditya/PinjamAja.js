const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { name, email, password, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, phone) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, email, hashedPassword, phone]
    );

    res.json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error("ERROR:", err); // ⬅️ ini penting
    res.status(500).json({ error: err.message }); // ⬅️ biar kelihatan di Postman
  }
};