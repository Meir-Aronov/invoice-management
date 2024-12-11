const { Pool } = require('pg');

// יצירת חיבור למסד PostgreSQL
const pool = new Pool({
  user: 'postgres', // שם המשתמש של PostgreSQL
  host: 'localhost', // כתובת השרת
  database: 'invoices', // שם מסד הנתונים שיצרת
  password: 'im1haker!!!', // סיסמת המשתמש
  port: 5432, // ברירת המחדל של PostgreSQL
});

// פונקציה להרצת שאילתות
const query = (text, params) => pool.query(text, params);

module.exports = { query };
