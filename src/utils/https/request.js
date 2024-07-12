const https = require('https');

const sendRequest = (apiURL, options, postData) => {
  return new Promise((resolve, reject) => {
    const request = https.request(apiURL, options, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        resolve(data);
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      request.write(postData);
    }
    request.end();
  });
};

module.exports = sendRequest;
