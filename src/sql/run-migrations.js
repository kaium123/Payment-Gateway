const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { connectDB } = require('../database/postgres');
const logger = require('../utils/logger');

// Create the schema_migrations table if it doesn't exist
const createSchemaMigration = async (client) => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version BIGINT PRIMARY KEY,
        dirty BOOLEAN NOT NULL
      );
    `);

    const result = await client.query('SELECT COUNT(*) FROM schema_migrations');
    const count = parseInt(result.rows[0].count, 10);

    if (count === 0) {
      await client.query('INSERT INTO schema_migrations (version, dirty) VALUES ($1, $2)', [0, false]);
    }
  } catch (err) {
    logger.error('Error creating schema_migrations table:', err);
    throw err;
  }
};

// Increment the migration version number in the schema_migrations table
const incrementMigrationNumber = async (client, newVersion) => {
  try {
    const migrationNumber = await getMigrationVersion(client);
    await client.query(
      `UPDATE schema_migrations
       SET version = $2, dirty = $3
       WHERE version = $1;`,
      [migrationNumber, newVersion, false]
    );
    logger.info(`Migration version updated to ${newVersion}`);
  } catch (err) {
    logger.error('Error incrementing migration version:', err);
    throw err;
  }
};

// Get the current migration version from the database
const getMigrationVersion = async (client) => {
  try {
    const result = await client.query('SELECT version FROM schema_migrations LIMIT 1');
    
    if (result.rows.length > 0) {
      const version = parseInt(result.rows[0].version, 10);
      if (isNaN(version)) {
        throw new Error(`Invalid version returned: ${result.rows[0].version}`);
      }
      return version;

    } else {
      logger.info('No migration version found');
      return 0; // Return a default value if no version is found

    }
  } catch (err) {
    logger.error('Error fetching migration version:', err);
    throw err;

  }
};

// Function to extract migration number from the filename
const extractMigrationNumber = (fileName) => {
  const match = fileName.match(/^(\d+)_/);
  if (match) {
    return parseInt(match[1], 10);
  }
  throw new Error('Invalid migration file name format');
};

// Perform migration
const migrate = async (client, dir) => {
  try {
    // Read all migration files from the directory
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.sql'));

    // Sort files to ensure the correct order
    files.sort();

    const currentMigrationVersion = await getMigrationVersion(client);
    let latestMigrationNumber = currentMigrationVersion;

    for (const file of files) {
      const filePath = path.join(dir, file);
      const fileName = path.basename(filePath);
      let migrationNumber;

      try {
        migrationNumber = extractMigrationNumber(fileName);
      } catch (error) {
        logger.error(`Skipping invalid migration file: ${fileName} - ${error.message}`);
        continue; 
      }

      if ((migrationNumber > currentMigrationVersion)) {
        const sql = fs.readFileSync(filePath, 'utf8');
        logger.info(`Executing migration file: ${file}`);
        logger.debug(`SQL Query:\n${sql}\n`);

        try {
          await client.query(sql);
          logger.info(`Migration ${file} applied successfully.`);
          latestMigrationNumber = migrationNumber;
        } catch (err) {
          logger.error(`Error applying migration ${file}:`, err);
          throw err; 
        }
      }
    }

    // Increment migration number only if there were successful migrations
    if (latestMigrationNumber > currentMigrationVersion) {
      await incrementMigrationNumber(client, latestMigrationNumber + 1);
    }
  } catch (err) {
    logger.error('Migration process failed:', err);
    throw err;
  }
};

// Main function to run migrations
const runMigrations = async () => {
  const migrationsDir = path.join(__dirname, 'migrations'); // Directory containing migration SQL files
  const client = await connectDB();

  try {
    await createSchemaMigration(client);
    await migrate(client, migrationsDir);
  } catch (err) {
    logger.error('Error applying migrations:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
};

module.exports = { runMigrations };
