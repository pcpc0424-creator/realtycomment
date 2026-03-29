const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (!rows.length) return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다' });
    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다' });
    const token = jwt.sign({ id: rows[0].id, username: rows[0].username, name: rows[0].name }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, name: rows[0].name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
