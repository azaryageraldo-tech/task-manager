const { body, validationResult } = require('express-validator');

exports.validateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nama kategori tidak boleh kosong')
    .isLength({ max: 50 }).withMessage('Nama kategori maksimal 50 karakter'),
  
  body('color')
    .optional()
    .isHexColor().withMessage('Warna harus dalam format hex (contoh: #FF0000)'),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Deskripsi maksimal 500 karakter'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];