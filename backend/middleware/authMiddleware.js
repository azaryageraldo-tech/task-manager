const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Token tidak ditemukan');
      return res.status(401).json({ message: 'Autentikasi diperlukan' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    console.log('Token terverifikasi untuk user:', decoded.id);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log('User tidak ditemukan');
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

module.exports = authMiddleware;