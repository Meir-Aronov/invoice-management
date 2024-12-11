const express = require('express');
const db = require('./db'); // חיבור למסד הנתונים
const cors = require('cors');

const app = express();
app.use(cors());

// חיבור לרוטות
const csvActionsRoutes = require('./routes/csvActions');
const invoicesRoutes = require('./routes/invoicesRoutes');
const suppliersRoutes = require('./routes/suppliersRoutes');

app.use(express.json()); // תמיכה ב-JSON
app.use(express.urlencoded({ extended: true })); // תמיכה ב-URL Encoded

// הגדרת ה-routes
app.use('/csv', csvActionsRoutes);
app.use('/invoices', invoicesRoutes);
app.use('/suppliers', suppliersRoutes);

app.listen(3010, () => {
  console.log('Server is running on http://localhost:3010');
});
