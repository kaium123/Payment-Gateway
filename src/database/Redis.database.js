const redis = require('redis');
const { redis: redisConfig } = require('../config/db-config');

const client = redis.createClient({
  host: redisConfig.host,
  port: redisConfig.port
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = client;
