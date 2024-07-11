// config/ACI-config.js
module.exports = {
  port: process.env.PORT || 3000,
  apiKeys: {
    oppwa: process.env.OPPWA_BEARER_TOKEN || 'OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg',
    shift4: process.env.SHIFT4_API_KEY || 'sk_test_KMLVbQzUBDYOJYshIzwYj5O6'
  },
  api: {
    aciBaseURL: 'https://eu-test.oppwa.com/v1',
    shift4BaseURL: 'https://api.shift4.com'
  }
};
