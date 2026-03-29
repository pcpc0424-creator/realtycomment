const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { status, member_type, page = 1, limit = 20 } = req.query;
    let sql = 'SELECT id, name, phone, email, member_type, status, notes, created_at FROM members WHERE 1=1';
    const params = [];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (member_type) { sql += ' AND member_type = ?'; params.push(member_type); }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(+limit, (+page - 1) * +limit);
    const [rows] = await db.query(sql, params);
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM members', []);
    res.json({ data: rows, total, page: +page, limit: +limit });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, phone, email, password, member_type, notes } = req.body;
    let password_hash = null;
    if (password) password_hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO members (name, phone, email, password_hash, member_type, notes) VALUES (?,?,?,?,?,?)',
      [name, phone, email, password_hash, member_type || '일반', notes]
    );
    res.json({ success: true, id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, phone, email, password, member_type, status, notes } = req.body;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await db.query('UPDATE members SET name=?, phone=?, email=?, password_hash=?, member_type=?, status=?, notes=? WHERE id=?',
        [name, phone, email, hash, member_type, status, notes, req.params.id]);
    } else {
      await db.query('UPDATE members SET name=?, phone=?, email=?, member_type=?, status=?, notes=? WHERE id=?',
        [name, phone, email, member_type, status, notes, req.params.id]);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 관리자: 개별 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, phone, email, member_type, status, notes, created_at FROM members WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: '없음' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM members WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
