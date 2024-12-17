const db = require("../db");

// pulls all invoices
const getAllInvoices = async () => {
  const query = `SELECT * FROM invoices`;
  const result = await db.query(query);
  return result;
};

// returning the status, cost and currency of each invoice
const getAllAggregatedInvoicesByStatus = async () => {
  const query = `
    SELECT invoice_status, invoice_cost, invoice_currency
    FROM invoices
  `;
  const result = await db.query(query);
  return result.rows;
};

// pulls out all expired invoices
const getAllOverdueInvoices = async () => {
  // fetch invoices that meet two conditions:
  // the due date (invoice_due_date) has passed (is less than the current date)
  // the invoice status is other than 'PAID'
  // the fields fetched are:
  // we will save all of this as overdue_details

  // then using SELECT
  // we count the number of overdue invoices using COUNT(*)
  // We use the json_agg function to return all the invoice details in JSON format
  const query = `
    WITH overdue_details AS (
        SELECT invoice_original_id, invoice_due_date, invoice_cost, invoice_currency
        FROM invoices
        WHERE invoice_due_date < CURRENT_DATE AND invoice_status != 'PAID'
      )
      SELECT 
        (SELECT COUNT(*) FROM overdue_details) as overdue_count,
        json_agg(overdue_details) as details
      FROM overdue_details;
  `;
  const result = await db.query(query);
  return result;
};

// pulls the invoice information
//(the query uses DATE_PART to break down the invoice_date into a month and a year)
const getAllMonthlySummary = async () => {
  const query = `
    SELECT 
        DATE_PART('month', invoice_date) AS month,
        DATE_PART('year', invoice_date) AS year,
        invoice_cost,
        invoice_currency
    FROM invoices
  `;
  const result = await db.query(query);
  return result.rows;
};

// to retrieve invoices by company name or all companies
const getInvoicesByCompanyName = async (companyName) => {
  let query;
  let queryParams; //gonna use params to avoid SQL Injection

  // if there is a company name
  // the query joins the invoices and suppliers tables by the supplier_id field
  // and filters by the company name
  if (companyName && companyName.trim() !== "") {
    query = `
        SELECT 
          s.supplier_company_name, 
          i.invoice_cost, 
          i.invoice_currency
        FROM invoices i
        JOIN suppliers s ON i.supplier_id = s.supplier_id
        WHERE s.supplier_company_name = $1;
      `;
    queryParams = [companyName];
  } else {
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

  const result = await db.query(query, queryParams);
  return result.rows;
};

module.exports = {
  getAllInvoices,
  getAllAggregatedInvoicesByStatus,
  getAllOverdueInvoices,
  getAllMonthlySummary,
  getInvoicesByCompanyName,
};
