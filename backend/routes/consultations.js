const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// 공개: 상담 신청 접수
router.post('/', async (req, res) => {
  try {
    const { category, name, phone, email, region, property_type, budget, invest_purpose, case_number, message } = req.body;
    const [result] = await db.query(
      'INSERT INTO consultations (category, name, phone, email, region, property_type, budget, invest_purpose, case_number, message) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [category, name, phone, email, region, property_type, budget, invest_purpose, case_number, message]
    );
    res.json({ success: true, id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 관리자: 목록 조회
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let sql = 'SELECT * FROM consultations';
    const params = [];
    if (status) { sql += ' WHERE status = ?'; params.push(status); }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(+limit, (+page - 1) * +limit);
    const [rows] = await db.query(sql, params);
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM consultations' + (status ? ' WHERE status = ?' : ''), status ? [status] : []);
    res.json({ data: rows, total, page: +page, limit: +limit });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 관리자: 상세 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM consultations WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: '없음' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 관리자: 상태 변경
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE consultations SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 관리자: 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM consultations WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
