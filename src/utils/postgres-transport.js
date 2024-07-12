const { TransportStream } = require('winston-transport');
const { Pool } = require('pg');

class PostgresTransport extends TransportStream {
  constructor(options) {
    super(options);
    this.pool = new Pool({
      connectionString: options.connectionString,
      ssl: options.ssl,
    });
    this.tableName = options.tableName || 'logs';
    this.schemaName = options.schemaName || 'public';

    this.pool.query(`
      CREATE TABLE IF NOT EXISTS ${this.schemaName}.${this.tableName} (
        id SERIAL PRIMARY KEY,
        level VARCHAR(50),
        message TEXT,
        meta JSONB,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      )
    `).catch(err => console.error('Error creating logs table:', err));
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info));
    const { level, message, ...meta } = info;

    this.pool.query(
      `INSERT INTO ${this.schemaName}.${this.tableName} (level, message, meta) VALUES ($1, $2, $3)`,
      [level, message, meta]
    ).catch(err => console.error('Error inserting log:', err));

    callback();
  }
}

module.exports = PostgresTransport;
