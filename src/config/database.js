import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(poolConfig);

// Helper to simulate pg-style query result for easier migration
export const query = async (text, params) => {
  const [rows] = await pool.execute(text, params);
  return { rows };
};

export { pool };

