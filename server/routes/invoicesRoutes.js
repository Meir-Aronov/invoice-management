const express = require("express");
const db = require("../db");
const router = express.Router();

const exchangeRates = {
  USD: 3.58, // USD to shekels
  EUR: 3.79, // EUR to shekels
  ILS: 1, // shekel
};

// get all invoices
router.get("/getAll", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM invoices");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving invoices" });
  }
});

// returns the accumulated amount according to each status
router.get("/aggregated-by-status", async (req, res) => {
  try {
    // in this query we returning the status, cost and currency of each invoice
    const result = await db.query(`
        SELECT invoice_status, invoice_cost, invoice_currency
        FROM invoices
      `);

    // this object will contain the finall amount the aggregated data
    const aggregatedData = {};

    // for each row we choosing the rate by the currency and converting to shekel
    result.rows.forEach((invoice) => {
      const rate = exchangeRates[invoice.invoice_currency] || 1; // ברירת מחדל אם לא נמצא מטבע
      const costInShekel = invoice.invoice_cost * rate;

      // after we converted the currency we will add the amount converted
      // to shekels into the existing amount for the status.
      if (!aggregatedData[invoice.invoice_status]) {
        aggregatedData[invoice.invoice_status] = 0;
      }

      aggregatedData[invoice.invoice_status] += costInShekel;
    });

    //converts the aggregatedData object to an array of [key, value] pairs
    //key (status) and value (aggregated amount)
    res.json(
      Object.entries(aggregatedData).map(([status, totalAmount]) => ({
        invoice_status: status,
        total_amount: totalAmount.toFixed(2), // rounding to two decimal places
      }))
    );
  } catch (error) {
    console.error("Error fetching aggregated data:", error);
    res.status(500).json({ error: "Failed to fetch aggregated data" });
  }
});

// // counts how many invoices are overdue
router.get("/overdue-invoices", async (req, res) => {
  try {
    const result = await db.query(`
      WITH overdue_details AS (
        SELECT invoice_original_id, invoice_due_date, invoice_cost, invoice_currency
        FROM invoices
        WHERE invoice_due_date < CURRENT_DATE AND invoice_status != 'PAID'
      )
      SELECT 
        (SELECT COUNT(*) FROM overdue_details) as overdue_count,
        json_agg(overdue_details) as details
      FROM overdue_details;
    `);

    // convert amounts to shekels
    const transformedDetails = result.rows[0].details.map((invoice) => {
      const rate = exchangeRates[invoice.invoice_currency] || 1;
      return {
        ...invoice,
        invoice_cost: (invoice.invoice_cost * rate).toFixed(2), // convert to shekels and save with 2 digits after the point
      };
    });

    res.status(200).json([
      {
        overdue_count: result.rows[0].overdue_count,
        details: transformedDetails,
      },
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving data" });
  }
});

//monthly summary of invoices
router.get("/monthly-summary", async (req, res) => {
  try {
    const result = await db.query(`
        SELECT 
          DATE_PART('month', invoice_date) AS month,
          DATE_PART('year', invoice_date) AS year,
          invoice_cost,
          invoice_currency
        FROM invoices
      `);

    const monthlyData = {};

    result.rows.forEach((invoice) => {
      const rate = exchangeRates[invoice.invoice_currency] || 1;
      const costInShekel = invoice.invoice_cost * rate;
      const key = `${invoice.year}-${invoice.month}`;

      if (!monthlyData[key]) {
        monthlyData[key] = 0;
      }

      monthlyData[key] += costInShekel;
    });

    res.json(
      Object.entries(monthlyData).map(([key, totalAmount]) => ({
        month: key.split("-")[1],
        year: key.split("-")[0],
        total_amount: totalAmount.toFixed(2),
      }))
    );
  } catch (error) {
    console.error("Error fetching monthly aggregated data:", error);
    res.status(500).json({ error: "Failed to fetch monthly aggregated data" });
  }
});

// get aggregated amount by the company_name or all of them
router.get("/aggregated-by-company_name", async (req, res) => {
  try {
    const { name } = req.query;

    let query;
    let queryParams;

    if (name && name.trim() !== "") {
      // If they sent a company name
      query = `
        SELECT 
          s.supplier_company_name, 
          i.invoice_cost, 
          i.invoice_currency
        FROM invoices i
        JOIN suppliers s ON i.supplier_id = s.supplier_id
        WHERE s.supplier_company_name = $1;
      `;
      queryParams = [name];
    } else {
      // If the name is empty - retrieve everything
      query = `
        SELECT 
          s.supplier_company_name, 
          i.invoice_cost, 
          i.invoice_currency
        FROM invoices i
        JOIN suppliers s ON i.supplier_id = s.supplier_id;
      `;
      queryParams = [];
    }
    const { rows } = await db.query(query, queryParams);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No invoices found for the given company" });
    }

    // processing the data to calculate the total in shekels
    const results = {};
    rows.forEach((invoice) => {
      const rate = exchangeRates[invoice.invoice_currency] || 1; // the default is shekel
      const costInILS = invoice.invoice_cost * rate;

      if (!results[invoice.supplier_company_name]) {
        results[invoice.supplier_company_name] = 0;
      }
      results[invoice.supplier_company_name] += costInILS;
    });

    // returning results in a convenient format
    const response = Object.entries(results).map(([company, total]) => ({
      supplier_company_name: company,
      total_cost_ils: total,
    }));

    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving invoices" });
  }
});

module.exports = router;

// Returns the accumulated amount according to each status (no conversion!!!!)
// router.get('/aggregated-by-status', async (req, res) => {
//   try {
//     const result = await db.query(`
//       SELECT invoice_status, SUM(invoice_cost) as total_amount
//       FROM invoices
//       GROUP BY invoice_status
//     `);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error retrieving data' });
//   }
// });

//Monthly summary of invoices (no conversion!!!!)
// router.get("/monthly-summary", async (req, res) => {
//   try {
//     const result = await db.query(`
//       SELECT TO_CHAR(invoice_date, 'YYYY-MM') as month, SUM(invoice_cost) as total_amount
//       FROM invoices
//       GROUP BY TO_CHAR(invoice_date, 'YYYY-MM')
//       ORDER BY month DESC
//     `);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error retrieving data" });
//   }
// });
