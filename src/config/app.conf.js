module.exports = {
    port: process.env.PORT || 3000,
    apiKeys: {
      oppwa: process.env.OPPWA_API_KEY || 'your_oppwa_api_key',
      shift4: process.env.SHIFT4_API_KEY || 'your_shift4_api_key'
    }
  };
  