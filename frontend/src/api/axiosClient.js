const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const accessTokenHeader = req.headers['x-access-token'];

  let token = null;

  if (typeof authHeader === 'string') {
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (bearerMatch?.[1]) {
      token = bearerMatch[1].trim();
    }
  }

  if (!token && typeof accessTokenHeader === 'string') {
    token = accessTokenHeader.trim();
  }

  // Fallbacks for environments where Authorization header can be stripped.
  if (!token && req.body?.token) {
    token = String(req.body.token).trim();
  }

  if (!token && req.query?.token) {
    token = String(req.query.token).trim();
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { protect };