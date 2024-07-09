// server.js
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const querystring = require('querystring');

// Load configuration
const aciConfig = require('./config/ACI-config');
const dbConfig = require('./config/db-config');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Load middleware
const { errorHandler } = require('./middleware/ErrorHandler.middleware');
app.use(errorHandler);

// Load routes

const aciRoutes = require('./routes/ACI-routes');

app.use('/api', aciRoutes);

// Connect to databases
const { connectRedis } = require('./database/Redis.database');
const { connectMongo } = require('./database/Pg.database');

// connectRedis();
// connectMongo();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
