const sequelize = require('../database/postgres-database');
const { PaymentRecord } = require('./payment-records');

const syncDatabase = async () => {
  try {
    // Sync database schema
    await sequelize.sync({ force: true }); // Optional: use { force: true } to recreate tables during development
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// Sync the database schema
syncDatabase();

module.exports = {
  sequelize,
  PaymentRecord
};
