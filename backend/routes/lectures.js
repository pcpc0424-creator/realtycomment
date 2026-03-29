const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, product_type, message } = req.body;
    const [result] = await db.query(
      'INSERT INTO lecture_applications (name, phone, email, product_type, message) VALUES (?,?,?,?,?)',
      [name, phone, email, product_type, message]
    );
    res.json({ success: true, id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let sql = 'SELECT * FROM lecture_applications';
    const params = [];
    if (status) { sql += ' WHERE status = ?'; params.push(status); }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(+limit, (+page - 1) * +limit);
    const [rows] = await db.query(sql, params);
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM lecture_applications' + (status ? ' WHERE status = ?' : ''), status ? [status] : []);
    res.json({ data: rows, total, page: +page, limit: +limit });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lecture_applications WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: '없음' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    await db.query('UPDATE lecture_applications SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM lecture_applications WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
