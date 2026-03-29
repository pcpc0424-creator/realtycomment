require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// 대시보드 통계
const auth = require('./middleware/auth');
app.get('/api/dashboard', auth, async (req, res) => {
  try {
    const [[c]] = await db.query('SELECT COUNT(*) as total, SUM(status="접수") as pending FROM consultations');
    const [[l]] = await db.query('SELECT COUNT(*) as total, SUM(status="접수") as pending FROM lecture_applications');
    const [[m]] = await db.query('SELECT COUNT(*) as total FROM members');
    const [[s]] = await db.query('SELECT COUNT(*) as total FROM success_cases WHERE is_published=1');
    const [recent] = await db.query('SELECT id, category, name, phone, status, created_at FROM consultations ORDER BY created_at DESC LIMIT 10');
    res.json({
      consultations: { total: c.total, pending: c.pending || 0 },
      lectures: { total: l.total, pending: l.pending || 0 },
      members: m.total,
      cases: s.total,
      recentConsultations: recent
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 파일 업로드
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
const sharp = require('sharp');
app.post('/api/upload', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: '파일이 없습니다' });
  try {
    const resizedName = 'r-' + req.file.filename;
    const resizedPath = path.join(__dirname, '../uploads', resizedName);
    await sharp(req.file.path)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(resizedPath);
    // 원본 삭제
    require('fs').unlinkSync(req.file.path);
    res.json({ url: '/realtycomment/uploads/' + resizedName });
  } catch (e) {
    res.json({ url: '/realtycomment/uploads/' + req.file.filename });
  }
});

// 라우트
app.use('/api/auth', require('./routes/auth'));
app.use('/api/member', require('./routes/member-auth'));
app.use('/api/consultations', require('./routes/consultations'));
app.use('/api/lectures', require('./routes/lectures'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/members', require('./routes/members'));
app.use('/api/content', require('./routes/content'));

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`Realtycomment API running on port ${PORT}`));
