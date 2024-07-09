const { Client } = require('pg');
const { postgres } = require('../config/db-config');

const client = new Client({
  connectionString: postgres.uri
});

client.connect()
  .then(() => {
    console.log('PostgreSQL connected');
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
  });

module.exports = client;
