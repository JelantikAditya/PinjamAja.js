const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  // 1. Cek apakah token ada
  if (!bearerHeader) {
    return res.status(403).json({ message: 'Token tidak ada' });
  }

  // Format: Bearer TOKEN
  const token = bearerHeader.split(' ')[1];

  try {
    // 2. Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Simpan info user ke request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};