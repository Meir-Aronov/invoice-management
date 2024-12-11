const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

//connecting to routes
const csvActionsRoutes = require('./routes/csvActions');
const invoicesRoutes = require('./routes/invoicesRoutes');
const suppliersRoutes = require('./routes/suppliersRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //encoded URL support

// setting the routes
app.use('/csv', csvActionsRoutes);
app.use('/invoices', invoicesRoutes);
app.use('/suppliers', suppliersRoutes);

app.listen(3010, () => {
  console.log('Server is running on http://localhost:3010');
});
