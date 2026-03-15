const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // hash password
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
    console.error(err.message);
    res.status(500).send("Server error");
  }
};