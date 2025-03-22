const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token); // Debug log

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error); // Debug log
    res.status(401).json({ message: 'Token is not valid' });
  }
};