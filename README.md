Payment Gateway API Documentation


Overview
    This API allows processing payments using Shift4 and ACI, and provides endpoints to retrieve payment status by ID. A command-line interface (CLI) is also provided to interact with the API.

Handling Payment Status Requests
    When I receive a request to check the payment status, I only get the transaction ID. I do not initially know whether this transaction is for an ACI payment or a Shift4 payment. To resolve this, I implemented a solution where, during the payment processing request, I store the transaction ID along with the provider type (ACI or Shift4) in my database.

When a request comes in to check the payment status, I first fetch the transaction details from the database to determine the provider type. If the provider type is ACI, I send the request to ACI's endpoint; otherwise, I send the request to Shift4's endpoint. This approach ensures that the request is directed to the correct payment provider.


Usage Instructions
    Clone the Repository

        git clone https://github.com/kaium123/Payment-Gateway.git

    Change Directory
        cd Payment-Gateway

    Install Dependencies
        npm install
    
    To configure the environment file, provide the appropriate values for ACI_BEARER_TOKEN, SHIFT4_API_KEY, and SHIFT4_TOKEN_CREATE_KEY. If you use Docker containers to access endpoints, set the environment variables in the Docker Compose file.

    Start project 
        Start the Node.js project:(add database configuration correctly in env)
            npm start
        or
        Start Docker Containers: ((add database configuration correctly in env))
            docker compose up

        Now we can process and check status of payments using REST API

    To usage CLI follow the instruction
        npm install 
        sudo npm install -g . 
        npm set prefix ~/.npm
        export PATH="$HOME/.npm/bin:$PATH"
        export PATH="./node_modules/.bin:$PATH"
        npm link

        Now we can process and check status of a payment


Endpoints
    1. Process a Payment using Shift4
        Endpoint: http://localhost:3000/api/payments/shift4

        Request Body:

        {
        "amount": 100.50,
        "currency": "USD",
        "description": "Payment for order #1234",
        "card": {
            "number": "4111111111111111",
            "holder": "John Doe",
            "expiryMonth": 12,
            "expiryYear": 2024,
            "cvv": "123"
        }
        }

        Response:

        {
            "id": "char_rsZCZ53Mlec6PSkZP3KBleDk",
            "created": 1720792144,
            "objectType": "charge",
            "amount": 100,
            "amountRefunded": 0,
            "currency": "USD",
            "description": "Payment for order #1234",
            "card": {
                "id": "card_QwP7IjTBGcFngWxr93NYvR69",
                "created": 1720792144,
                "objectType": "card",
                "first6": "411111",
                "last4": "1111",
                "fingerprint": "1xzMpqXToFD1H03S",
                "expMonth": "12",
                "expYear": "2024",
                "cardholderName": "John Doe",
                "brand": "Visa",
                "type": "Credit Card",
                "country": "CH",
                "issuer": "SHIFT4 TEST"
            },
            "captured": true,
            "refunded": false,
            "disputed": false,
            "fraudDetails": {
                "status": "in_progress"
            },
            "avsCheck": {
                "result": "unavailable"
            },
            "status": "successful",
            "clientObjectId": "client_char_TPIujtdqsM6UWsNedMMR6rYF"
        }

    2. Process a Payment using ACI
        Endpoint: POST http://localhost:3000/api/payments/aci

        Request Body:
        {
        "amount": "92.00",
        "currency": "EUR",
        "paymentBrand": "VISA",
        "paymentType": "DB",
        "card": {
            "number": "4200000000000000",
            "holder": "Jane Jones",
            "expiryMonth": "05",
            "expiryYear": "2034",
            "cvv": "123"
        }
        }

        Response:
        {
            "id": "8ac7a4a090a4e6c60190a73b64ac7859",
            "paymentType": "DB",
            "paymentBrand": "VISA",
            "amount": "92.00",
            "currency": "EUR",
            "descriptor": "0697.0278.5167 OPP_Channel ",
            "result": {
                "code": "000.100.110",
                "description": "Request successfully processed in 'Merchant in Integrator Test Mode'"
            },
            "resultDetails": {
                "clearingInstituteName": "Elavon-euroconex_UK_Test"
            },
            "card": {
                "bin": "420000",
                "last4Digits": "0000",
                "holder": "Jane Jones",
                "expiryMonth": "05",
                "expiryYear": "2034"
            },
            "risk": {
                "score": "100"
            },
            "buildNumber": "d7c8b82138c319cb28b8bf69e87b72549f520681@2024-07-12 00:42:34 +0000",
            "timestamp": "2024-07-12 13:56:46.038+0000",
            "ndc": "8a8294174b7ecb28014b9699220015ca_ddc8b9cf61df4bdabd91b509d1774c11",
            "source": "OPP",
            "paymentMethod": "CC",
            "shortId": "0697.0278.5167"
        }

    3. Retrieve Payment Status by ID
        Endpoint: GET http://localhost:3000/api/payments/:id

        Response:
        {
            "transactionID": "8ac7a4a090a4e6c60190a73494525890",
            "transactionType": "aci",
            "entityID": "8a8294174b7ecb28014b9699220015ca",
            "aciStatus": {
                "id": "8ac7a4a090a4e6c60190a73494525890",
                "paymentType": "DB",
                "paymentBrand": "VISA",
                "amount": "92.00",
                "currency": "EUR",
                "descriptor": "1743.9297.3455 OPP_Channel",
                "result": {
                    "code": "000.100.110",
                    "description": "Request successfully processed in 'Merchant in Integrator Test Mode'"
                },
                "resultDetails": {
                    "clearingInstituteName": "Elavon-euroconex_UK_Test"
                },
                "card": {
                    "bin": "420000",
                    "last4Digits": "0000",
                    "holder": "Jane Jones",
                    "expiryMonth": "05",
                    "expiryYear": "2034",
                    "issuer": {
                        "bank": "JPMORGAN CHASE BANK, N.A.",
                        "website": "HTTPS://WWW.CHASE.COM/",
                        "phone": "+ (1) 212-270-6000"
                    },
                    "type": "CREDIT",
                    "country": "US",
                    "maxPanLength": "16",
                    "binType": "PERSONAL",
                    "regulatedFlag": "Y"
                },
                "threeDSecure": {
                    "eci": "07"
                },
                "customParameters": {
                    "CTPE_DESCRIPTOR_TEMPLATE": ""
                },
                "risk": {
                    "score": "100"
                },
                "buildNumber": "d7c8b82138c319cb28b8bf69e87b72549f520681@2024-07-12 00:42:34 +0000",
                "timestamp": "2024-07-12 13:49:19.405+0000",
                "ndc": "8a8294174b7ecb28014b9699220015ca_c0f00012ae454b50b305af5f0fc8adeb"
            }
        }

Command-Line Interface (CLI)
    Payment with ACI
        pay_with aci --amount 100 --currency USD --card_number 4111111111111111 --expiry_date 12/23 --cvv 123 --card_holder "Jane Jones"

    Reponse:
        Payment created: {
            id: '8ac7a4a190a7734a0190a79084940b59',
            paymentType: 'DB',
            paymentBrand: 'VISA',
            result: {
                code: '100.390.106',
                description: 'Transaction rejected because of error in 3DSecure configuration'
            },
            resultDetails: { clearingInstituteName: 'JCB via B24-eps' },
            card: {
                bin: '411111',
                last4Digits: '1111',
                holder: 'Jane Jones',
                expiryMonth: '12',
                expiryYear: '2023'
            },
            risk: { score: '100' },
            buildNumber: 'd7c8b82138c319cb28b8bf69e87b72549f520681@2024-07-12 00:42:34 +0000',
            timestamp: '2024-07-12 15:29:44.599+0000',
            ndc: '8a8294174b7ecb28014b9699220015ca_f3839c5ed92b49b0861645386112ddd4',
            source: 'OPP',
            paymentMethod: 'DC',
            shortId: '2652.6409.5375'
        }


    Payment with Shift4
        pay_with shift4 --amount 100 --currency USD --card_number 4111111111111111 --expiry_date 12/23 --cvv 123 --card_holder "Jane Jones"
    Response: 
        Payment created: {
            id: '8ac7a4a290a77bcf0190a792250f5893',
            paymentType: 'DB',
            paymentBrand: 'VISA',
            result: {
                code: '100.390.106',
                description: 'Transaction rejected because of error in 3DSecure configuration'
            },
            resultDetails: { clearingInstituteName: 'JCB via B24-eps' },
            card: {
                bin: '411111',
                last4Digits: '1111',
                holder: 'Jane Jones',
                expiryMonth: '12',
                expiryYear: '2023'
            },
            risk: { score: '100' },
            buildNumber: 'd7c8b82138c319cb28b8bf69e87b72549f520681@2024-07-12 00:42:34 +0000',
            timestamp: '2024-07-12 15:31:31.219+0000',
            ndc: '8a8294174b7ecb28014b9699220015ca_ae1c717c277b4a1c995f1e45d8fe7572',
            source: 'OPP',
            paymentMethod: 'DC',
            shortId: '8238.7854.1455'
        }

    Get Payment Status
        get_payment_status --payment_id 8ac7a4a290a77bcf0190a792250f5893

    Response : 
        Payment status: {
            transactionID: '8ac7a4a290a77bcf0190a792250f5893',
            transactionType: 'aci',
            entityID: '8a8294174b7ecb28014b9699220015ca',
            aciStatus: {
                id: '8ac7a4a290a77bcf0190a792250f5893',
                paymentType: 'DB',
                paymentBrand: 'VISA',
                result: {
                code: '100.390.106',
                description: 'Transaction rejected because of error in 3DSecure configuration'
                },
                resultDetails: { clearingInstituteName: 'JCB via B24-eps' },
                card: {
                bin: '411111',
                last4Digits: '1111',
                holder: 'Jane Jones',
                expiryMonth: '12',
                expiryYear: '2023',
                issuer: [Object],
                type: 'DEBIT',
                level: 'CLASSIC',
                country: 'PL',
                maxPanLength: '16',
                binType: 'PERSONAL',
                regulatedFlag: 'N'
                },
                customParameters: { CTPE_DESCRIPTOR_TEMPLATE: '' },
                risk: { score: '100' },
                buildNumber: 'd7c8b82138c319cb28b8bf69e87b72549f520681@2024-07-12 00:42:34 +0000',
                timestamp: '2024-07-12 15:31:31.219+0000',
                ndc: '8a8294174b7ecb28014b9699220015ca_9252615d52d84abf82d589c61cf11037'
            }
        }

Usage Instructions
    Clone the Repository

        git clone https://github.com/kaium123/Payment-Gateway.git

    cd Payment-Gateway
        Install Dependencies
        npm install
        docker compose up

    To usage CLI follow the instruction
        npm install 
        sudo npm install -g . 
        npm set prefix ~/.npm
        export PATH="$HOME/.npm/bin:$PATH"
        export PATH="./node_modules/.bin:$PATH"
        npm link








# Payment-Gateway
init project packages
npm init -y
npm install express body-parser joi pg dotenv

grant permission
chmod +x src/bin/*.js



enable cli

npm install 
sudo npm install -g . 
npm set prefix ~/.npm
export PATH="$HOME/.npm/bin:$PATH"
export PATH="./node_modules/.bin:$PATH"
npm link


sql migration

npm install node-sql-migrations pg
npm install node-pg-migrate

install sequelize
npm install sequelize pg

install logger package
npm install pino

npm install dateformat

npm install winston-daily-rotate-file
