CREATE TABLE payment_records (
  id SERIAL PRIMARY KEY,                        
  transactionID VARCHAR(255) NOT NULL,
  transactionType VARCHAR(255) NOT NULL,
  entityID VARCHAR(255),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);
