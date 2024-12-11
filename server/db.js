const { Pool } = require('pg');

// Creating a connection to the PostgreSQL database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'invoices',
  password: 'im1haker!!!',
  port: 5432,
});

//Function for running queries
const query = (text, params) => pool.query(text, params);

module.exports = { query };
