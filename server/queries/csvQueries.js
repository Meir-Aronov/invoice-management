const db = require("../db");

// adding suppliers to the database
const insertSupplier = async (supplier) => {
  try {
    const query = `
      INSERT INTO suppliers (
        supplier_internal_id, supplier_external_id, supplier_company_name, 
        supplier_address, supplier_city, supplier_country, supplier_contact_name, 
        supplier_phone, supplier_email, supplier_bank_code, 
        supplier_bank_branch_code, supplier_bank_account_number, 
        supplier_status, supplier_stock_value, supplier_withholding_tax
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`;

    // Object.values returns an array of values of an object
    await db.query(query, Object.values(supplier));
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL unique violation error code
      throw new Error(
        `Supplier Internal ID "${supplier.supplier_internal_id}" must be unique.`
      );
    }
    throw error; 
  }
};

// search for a provider by its internal ID
const findSupplierByInternalId = async (supplierInternalId) => {
  const query = `SELECT supplier_id FROM suppliers WHERE supplier_internal_id = $1`;
  const result = await db.query(query, [supplierInternalId]);
  return result.rows[0]?.supplier_id || null;
};

// adding invoices to the database
const insertInvoice = async (invoice, supplierId) => {
  const query = `
    INSERT INTO invoices (
      invoice_date, invoice_due_date, invoice_cost, invoice_currency, 
      invoice_status, supplier_id, invoice_original_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`;

  await db.query(query, [
    invoice.invoice_date,
    invoice.invoice_due_date,
    invoice.invoice_cost,
    invoice.invoice_currency,
    invoice.invoice_status,
    supplierId,
    invoice.invoice_original_id,
  ]);
};

module.exports = {
  insertSupplier,
  findSupplierByInternalId,
  insertInvoice,
};
