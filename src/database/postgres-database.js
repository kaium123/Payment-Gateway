const { Client } = require('pg');
const { postgres } = require('../config/db-config');



const connect = async () => {
  const client = new Client({
    connectionString: postgres.uri
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Connection to PostgreSQL database failed', err);
    throw err;
  }
};

module.exports = { connect };

