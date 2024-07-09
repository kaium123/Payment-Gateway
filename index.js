const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const querystring = require('querystring');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

app.post('/api/payments', (req, res) => {
  // Log the incoming request body
  console.log('Request Body:', req.body);

  const { entityId, amount, currency, paymentBrand, paymentType, 'card.number': cardNumber, 'card.holder': cardHolder, 'card.expiryMonth': expiryMonth, 'card.expiryYear': expiryYear, 'card.cvv': cvv } = req.body;

  const postData = querystring.stringify({
    entityId: entityId,
    amount: amount,
    currency: currency,
    paymentBrand: paymentBrand,
    paymentType: paymentType,
    'card.number': cardNumber,
    'card.holder': cardHolder,
    'card.expiryMonth': expiryMonth,
    'card.expiryYear': expiryYear,
    'card.cvv': cvv
  });

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const apiURL = 'https://eu-test.oppwa.com/v1/payments';

  const paymentReq = https.request(apiURL, options, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      console.log('API Response:', data); // Log the API response
      res.send(data);
    });
  });

  paymentReq.on('error', (error) => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });

  paymentReq.write(postData);
  paymentReq.end();
});

  

// Endpoint to get payment status
app.get('/api/payments/:paymentID', (req, res) => {
  const paymentID = req.params.paymentID;
  const apiURL = `https://eu-test.oppwa.com/v1/payments/${paymentID}?entityId=8a8294174b7ecb28014b9699220015ca`;
  
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg=`
    }
  };

  const paymentStatusReq = https.request(apiURL, options, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.send(data);
    });
  });

  paymentStatusReq.on('error', (error) => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });

  paymentStatusReq.end();
});

// Endpoint to create a charge
app.post('/api/charges', (req, res) => {
  const { amount, currency, card, description } = req.body;

  const postData = JSON.stringify({
    amount: amount,
    currency: currency,
    card: card,
    description: description
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from('sk_test_KMLVbQzUBDYOJYshIzwYj5O6:').toString('base64')}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const chargesReq = https.request('https://api.shift4.com/charges', options, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.send(data);
    });
  });

  chargesReq.on('error', (error) => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });

  chargesReq.write(postData);
  chargesReq.end();
});

// Endpoint to get charge status
app.get('/api/charges/:chargeID', (req, res) => {
  const chargeID = req.params.chargeID;
  const apiURL = `https://api.shift4.com/charges/${chargeID}`;
  
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from('sk_test_KMLVbQzUBDYOJYshIzwYj5O6:').toString('base64')}`
    }
  };

  const chargeStatusReq = https.request(apiURL, options, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      res.send(data);
    });
  });

  chargeStatusReq.on('error', (error) => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });

  chargeStatusReq.end();
});

// Endpoint to create a token
app.post('/api/tokens', (req, res) => {
  const { number, expMonth, expYear, cvc, cardholderName } = req.body;

  const postData = JSON.stringify({
    number: number,
    expMonth: expMonth,
    expYear: expYear,
    cvc: cvc,
    cardholderName: cardholderName
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from('pk_test_KMLVbPcojXEwtbrP52fCmCJ9:').toString('base64')}`,
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const tokensReq = https.request('https://api.shift4.com/tokens', options, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      try {
        const tokenResponse = JSON.parse(data);
        res.send(tokenResponse);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).send('Internal Server Error');
      }
    });
  });

  tokensReq.on('error', (error) => {
    console.error('Request error:', error);
    res.status(500).send('Internal Server Error');
  });

  tokensReq.write(postData);
  tokensReq.end();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
