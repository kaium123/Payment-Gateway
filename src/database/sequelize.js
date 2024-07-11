const { Sequelize } = require('sequelize');
const config = require('../config/db-config').postgres;

const sequelize = new Sequelize(config.PG_DB, config.PG_USER, config.PG_PASSWORD, {
  host: config.PG_HOST,
  dialect: "postgres",
});

module.exports = sequelize;