require('dotenv').config();

// Add this for debugging
console.log('Environment variables loaded:', {
  jwt: process.env.JWT_SECRET,
  port: process.env.PORT
});

const express = require('express');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const notificationRoutes = require('./routes/notifications');
const subtaskRoutes = require('./routes/subtasks');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subtasks', subtaskRoutes);

const PORT = process.env.PORT || 5000;

// Fungsi untuk mencoba port yang tersedia
const findAvailablePort = async (startPort) => {
  const net = require('net');
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
};

db.sequelize.sync()
  .then(async () => {
    console.log('Database berhasil tersinkronisasi');
    const availablePort = await findAvailablePort(PORT);
    app.listen(availablePort, () => {
      console.log(`Server berjalan di http://localhost:${availablePort}`);
    });
  })
  .catch(err => {
    console.error('Gagal menghubungkan ke database:', err);
  });