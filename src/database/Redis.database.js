const redis = require('redis');
const { redis: redisConfig } = require('../config/db.conf');

const client = redis.createClient({
  host: redisConfig.host,
  port: redisConfig.port
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = client;
