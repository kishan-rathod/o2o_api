// db.js
import pkg from 'pg';
const { Pool } = pkg;

function createPool(config) {
  return new Pool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
  });
}

// Root database configuration
const rootDbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
}

const rootPool = createPool(rootDbConfig);

const db = {
  rootPool,
  createPool,
};

export default db;
