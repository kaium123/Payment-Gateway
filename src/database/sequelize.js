// src/database/postgres-database.js
const { Sequelize } = require('sequelize');
const { postgres } = require('../config/db-config');

const sequelize = new Sequelize(
    postgres.PG_DB,
    postgres.PG_USER,
    postgres.PG_PASSWORD,
    {
        host: postgres.PG_HOST,
        dialect: 'postgres',
    }
);

module.exports = sequelize;
