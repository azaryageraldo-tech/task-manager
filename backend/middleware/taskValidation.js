const validateTask = (req, res, next) => {
  const { title, priority, status, deadline } = req.body;
  
  // Validasi title hanya jika ada dalam request body
  if (title !== undefined && (title.trim().length < 3)) {
    return res.status(400).json({ message: 'Judul tugas minimal 3 karakter' });
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ message: 'Priority tidak valid' });
  }

  const validStatuses = ['pending', 'in_progress', 'completed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid' });
  }

  if (deadline && new Date(deadline) < new Date()) {
    return res.status(400).json({ message: 'Deadline tidak boleh di masa lalu' });
  }

  next();
};

module.exports = { validateTask };