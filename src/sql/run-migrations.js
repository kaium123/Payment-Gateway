const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const {connectDB } = require('../database/postgres')

// Define migration direction constants
const DirectionUp = 'up';
const DirectionDown = 'down';


// Check migration direction
const checkDirection = (direction) => {
  if (direction !== DirectionUp && direction !== DirectionDown) {
    throw new Error(`Migration direction is not valid: ${direction}`);
  }
};

// Create a PostgreSQL client
const createClient = async (url) => {
  const client = new Client({
    connectionString: url,
  });

  await client.connect();
  return client;
};

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
    console.error('Error creating schema_migrations table:', err);
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
    console.log(`Migration version updated to ${newVersion}`);
  } catch (err) {
    console.error('Error incrementing migration version:', err);
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
      console.log('No migration version found');
      return 0; // Return a default value if no version is found
    }
  } catch (err) {
    console.error('Error fetching migration version:', err);
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

// Perform migration from fs.FS source
const migrateFromFS = async (client, direction, dir) => {
  checkDirection(direction);

  // Read all migration files from the directory
  const files = fs.readdirSync(dir).filter(file => file.endsWith('.sql'));

  // Sort files to ensure the correct order
  files.sort();

  const currentMigrationVersion = await getMigrationVersion(client);
  let latestMigrationNumber = currentMigrationVersion;
  console.log("currentMigrationVersion. ",currentMigrationVersion)

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileName = path.basename(filePath);
    let migrationNumber;

    try {
      migrationNumber = extractMigrationNumber(fileName);
      console.log('Migration Number:', migrationNumber);
    } catch (error) {
      console.error(error.message);
      continue; // Skip this file if there's an error extracting the number
    }

    if ((direction === DirectionUp && migrationNumber > currentMigrationVersion)) {
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`Executing migration file: ${file}`);
      console.log(`SQL Query:\n${sql}\n`);

      try {
        await client.query(sql);
        console.log(`Migration ${file} applied successfully.`);
        latestMigrationNumber = migrationNumber;
      } catch (err) {
        console.error(`Error applying migration ${file}:`, err);
        throw err; // Rethrow error if migration fails
      }
    }
  }

  console.log(latestMigrationNumber, " ", currentMigrationVersion, " ", direction);
  // Increment migration number only if there were successful migrations
  if (direction === DirectionUp && latestMigrationNumber > currentMigrationVersion) {
    console.log("here");
    await incrementMigrationNumber(client, latestMigrationNumber + 1);
  }
};

// Main function to run migrations
const runMigrations = async () => {
  const url = 'postgres://root:123456@localhost:5432/me_db'; // Replace with your PostgreSQL connection URL
  const direction = 'up'; // or 'down'
  const migrationsDir = path.join(__dirname, 'migrations'); // Directory containing migration SQL files

  const client = await connectDB()

  try {
    await createSchemaMigration(client);
    await migrateFromFS(client, direction, migrationsDir);
  } catch (err) {
    console.error('Error applying migrations:', err);
    process.exit(1);
  } finally {
    await client.end(); // Close the client connection
  }
};

module.exports = { runMigrations };

// Uncomment the following line to execute the migrations when this file is run directly
// runMigrations();
