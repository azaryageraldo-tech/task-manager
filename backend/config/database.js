const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('task_manager', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log // Enable logging temporarily
});

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    // Sync database in development
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit if database connection fails
  });

module.exports = sequelize;