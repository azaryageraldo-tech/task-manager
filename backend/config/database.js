const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('task_manager', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // Disable logging for production
});

// Test connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

module.exports = sequelize;