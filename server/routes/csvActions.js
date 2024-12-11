const express = require('express');
const db = require('../db');
const router = express.Router();

const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// setting up Multer to save files temporarily
const upload = multer({ dest: 'uploads/' });

router.post('/upload-csv', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const suppliers = [];
    const invoices = [];
  
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // processing the data for each row
        suppliers.push({
          supplier_internal_id: row.supplier_internal_id,
          supplier_external_id: row.supplier_external_id,
          supplier_company_name: row.supplier_company_name,
          supplier_address: row.supplier_address,
          supplier_city: row.supplier_city,
          supplier_country: row.supplier_country,
          supplier_contact_name: row.supplier_contact_name,
          supplier_phone: row.supplier_phone,
          supplier_email: row.supplier_email,
          supplier_bank_code: row.supplier_bank_code,
          supplier_bank_branch_code: row.supplier_bank_branch_code,
          supplier_bank_account_number: row.supplier_bank_account_number,
          supplier_status: row.supplier_status,
          supplier_stock_value: row.supplier_stock_value,
          supplier_withholding_tax: row.supplier_withholding_tax,
        });
  
        invoices.push({
          invoice_date: row.invoice_date,
          invoice_due_date: row.invoice_due_date,
          invoice_cost: row.invoice_cost,
          invoice_currency: row.invoice_currency,
          invoice_status: row.invoice_status,
          supplier_internal_id: row.supplier_internal_id,
          invoice_original_id: row.invoice_id,
        });
      })
      .on('end', async () => {
        try {
          // supplier retention
          for (const supplier of suppliers) {
            await db.query(
              `INSERT INTO suppliers (supplier_internal_id, supplier_external_id, supplier_company_name, 
                supplier_address, supplier_city, supplier_country, supplier_contact_name, supplier_phone, 
                supplier_email, supplier_bank_code, supplier_bank_branch_code, supplier_bank_account_number, 
                supplier_status, supplier_stock_value, supplier_withholding_tax) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
              Object.values(supplier)
            );
          }
  
          // saving invoices
          for (const invoice of invoices) {
            const supplier = await db.query(
              'SELECT supplier_id FROM suppliers WHERE supplier_internal_id = $1',
              [invoice.supplier_internal_id]
            );
  
            if (supplier.rows.length > 0) {
              await db.query(
                `INSERT INTO invoices (invoice_date, invoice_due_date, invoice_cost, invoice_currency, invoice_status, supplier_id, invoice_original_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                  invoice.invoice_date,
                  invoice.invoice_due_date,
                  invoice.invoice_cost,
                  invoice.invoice_currency,
                  invoice.invoice_status,
                  supplier.rows[0].supplier_id,
                  invoice.invoice_original_id,
                ]
              );
            }
          }
          res.status(200).json({ message: 'File processed successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error processing file' });
        } finally {
          fs.unlinkSync(filePath); // delete the file after processing
        }
      });
  });

module.exports = router;
