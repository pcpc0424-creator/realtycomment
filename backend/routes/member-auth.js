const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ error: '모든 필수 항목을 입력해주세요' });
    }
    // 이메일 중복 체크
    const [existing] = await db.query('SELECT id FROM members WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ error: '이미 가입된 이메일입니다' });

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO members (name, phone, email, password_hash) VALUES (?,?,?,?)',
      [name, phone, email, password_hash]
    );
    const token = jwt.sign({ id: result.insertId, name, email, type: 'member' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM members WHERE email = ? AND status = "활성"', [email]);
    if (!rows.length) return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' });
    if (!rows[0].password_hash) return res.status(401).json({ error: '비밀번호가 설정되지 않은 계정입니다. 관리자에게 문의하세요' });

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' });

    const token = jwt.sign({ id: rows[0].id, name: rows[0].name, email: rows[0].email, type: 'member' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, name: rows[0].name, memberType: rows[0].member_type });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
