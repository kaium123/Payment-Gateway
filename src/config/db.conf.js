module.exports = {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    },
    postgres: {
        uri: process.env.POSTGRES_URI || 'postgresql://root:123456@localhost:5432/me_db'
      }
      
  };
  