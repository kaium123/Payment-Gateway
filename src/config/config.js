// config/ACI-config.js

require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  port: process.env.PORT,
  apiKeys: {
    aciBrearerToken: process.env.ACI_BEARER_TOKEN,
    shift4ApiKey: process.env.SHIFT4_API_KEY,
    aciEntityID: process.env.ACI_ENTITY_ID

  },
  api: {
    aciBaseURL: process.env.ACI_BASE_URL,
    shift4BaseURL: process.env.SHIFT4_BASE_URL,    
  }
};
