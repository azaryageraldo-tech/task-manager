const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log // Tambahkan ini untuk debug
  }
);

// Test connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('Database terhubung dengan sukses');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database berhasil disinkronkan');
  })
  .catch(err => {
    console.error('Error koneksi database:', err);
    process.exit(1);
  });

module.exports = sequelize;