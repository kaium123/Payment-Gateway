CREATE TABLE payment_records (
  id SERIAL PRIMARY KEY,                        
  payment_id VARCHAR(255) UNIQUE NOT NULL,      
  payment_type VARCHAR(50) NOT NULL,    
  entity_id VARCHAR(50) NOT NULL,                  
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NULL,
  deleted_at         TIMESTAMPTZ DEFAULT NULL
);
