const { Client } = require('pg');
const { postgres } = require('../config/db-config');

const connectDB = async () => {
  const client = new Client({
    connectionString: postgres.uri,
  });

  await client.connect();
  console.log(typeof(client))
  return client;
};

module.exports = { connectDB };

