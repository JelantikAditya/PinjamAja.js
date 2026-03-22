const pool = require('../config/db');
const express = require("express");
const router = express.Router();
const { registerUser, login } = require("../controllers/authController");
const { verifyToken } = require('../middleware/authMiddleware');

router.post("/register", registerUser);

router.post("/login", login);

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, email FROM users WHERE id = $1',
      [req.user.id]
    );

    res.json({
      message: 'Akses berhasil',
      user: user.rows[0]
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;