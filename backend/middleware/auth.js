const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../.env' });

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '인증이 필요합니다' });
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: '토큰이 만료되었거나 유효하지 않습니다' });
  }
};
