const https = require('https');
const logger = require('./logger'); // Assuming you have a logger utility

const sendRequest = (apiURL, options, postData) => {
  return new Promise((resolve, reject) => {
    const request = https.request(apiURL, options, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        if (apiRes.statusCode >= 200 && apiRes.statusCode < 300) {
          resolve(data);
        } else {
          const error = new Error(`Request failed with status code ${apiRes.statusCode}`);
          error.statusCode = apiRes.statusCode;
          error.responseData = data;
          logger.error('Error in response', error.message);
          reject(error);
        }
      });
    });

    request.on('error', (error) => {
      logger.error('Request error',  error.message);
      reject(error);
    });

    if (postData) {
      request.write(postData);
    }

    request.end();
  });
};

module.exports = sendRequest;
