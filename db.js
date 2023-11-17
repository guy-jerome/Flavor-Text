const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DB_KEY,
});

// Database Functions
async function dataBaseQuery(query, args = []) {
  const client = await pool.connect();
  try {
    const response = await client.query(query, args);
    return response.rows;
  } catch (err) {
    console.error('Error executing database query:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  dataBaseQuery,

};