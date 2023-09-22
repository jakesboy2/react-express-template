require('ts-node/register');
const path = require('path');
const dotenv = require('dotenv');

if (process.env.IS_MIGRATE) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
} else {
  dotenv.config();
}

let databaseLocation = process.env.APPDATA;
// if we're on mac, no app data folder in the env
if (!databaseLocation) {
  databaseLocation = process.env.HOME;
}

const sqlLiteFile = path.resolve(databaseLocation, 'dev.sqlite3');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: sqlLiteFile,
    },
    migrations: {
      extension: 'ts',
      tableName: 'knex_migrations',
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    migrations: 'ts',
    tableName: 'knex_migrations',
  },
  useNullAsDefault: true,
};
