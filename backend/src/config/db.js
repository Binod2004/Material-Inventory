const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fallbackDb = require('./fallback-db');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vizag_inventory',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

let fallbackMode = false;

async function query(sql, params = []) {
  if (fallbackMode) {
    return fallbackDb.query(sql, params);
  }

  try {
    return await pool.query(sql, params);
  } catch (error) {
    if (error && (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ER_ACCESS_DENIED_ERROR')) {
      fallbackMode = true;
      console.warn('Database unavailable, switching to fallback storage.');
      return fallbackDb.query(sql, params);
    }
    throw error;
  }
}

module.exports = { query, isFallback: () => fallbackMode };
