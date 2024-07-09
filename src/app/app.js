const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const aciRoutes = require('../routes/ACI-routes');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Load middleware
const { errorHandler } = require('../middleware/error-handler');
app.use(errorHandler);

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.sseSetup = () => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
  };

  res.sseSend = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  res.sseStop = () => {
    res.end();
  }

  next();
});

app.use('/api', aciRoutes);

module.exports = app;