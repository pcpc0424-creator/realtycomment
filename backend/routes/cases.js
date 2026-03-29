const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/public', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM success_cases WHERE is_published = 1 ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/public/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM success_cases WHERE id = ? AND is_published = 1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: '없음' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM success_cases ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM success_cases WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: '없음' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, location, property_type, appraisal_price, winning_price, profit_rate, image_url, images, is_published } = req.body;
    const [result] = await db.query(
      'INSERT INTO success_cases (title, description, location, property_type, appraisal_price, winning_price, profit_rate, image_url, images, is_published) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [title, description, location, property_type, appraisal_price, winning_price, profit_rate, image_url, images || '[]', is_published ?? 1]
    );
    res.json({ success: true, id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, location, property_type, appraisal_price, winning_price, profit_rate, image_url, images, is_published } = req.body;
    await db.query(
      'UPDATE success_cases SET title=?, description=?, location=?, property_type=?, appraisal_price=?, winning_price=?, profit_rate=?, image_url=?, images=?, is_published=? WHERE id=?',
      [title, description, location, property_type, appraisal_price, winning_price, profit_rate, image_url, images || '[]', is_published, req.params.id]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM success_cases WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
