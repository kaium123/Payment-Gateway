module.exports = {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    },
    postgres: {
        uri: process.env.POSTGRES_URI || 'postgresql://root:123456@localhost:5432/payment_gateway',
        PG_DB: process.env.PG_DB || 'payment_gateway',
        PG_USER: process.env.PG_USER || 'root',
        PG_PASSWORD: process.env.PG_PASSWORD || '123456',
        PG_HOST: process.env.PG_HOST || 'localhost',
      }
      
  };


  
  