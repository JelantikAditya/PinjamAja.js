const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Cari user berdasarkan email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    // ❗ Kenapa dicek?
    // Karena kalau user tidak ada → langsung stop
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const user = userResult.rows[0];

    // 2. Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);

    // ❗ Kenapa pakai bcrypt.compare?
    // Karena password di DB itu HASH, bukan plain text
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // 3. Generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // ❗ Kenapa payload hanya id & email?
    // Jangan simpan data sensitif di token!

    // 4. Kirim ke user
    res.json({
      message: 'Login berhasil',
      token
    });

  

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};