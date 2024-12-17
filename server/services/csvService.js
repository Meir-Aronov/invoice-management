const fs = require("fs"); //for files actions
const csv = require("csv-parser"); //to read and parse the lines of a CSV file
const {
  insertSupplier,
  findSupplierByInternalId,
  insertInvoice,
} = require("../queries/csvQueries");

// processing the file and loading the data
const processCsvFile = async (filePath) => {
  const suppliers = [];
  const invoices = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath) //allows to read or write data incrementally instead of reading a large file into the entire memory (which can cause a crash)
      .pipe(csv())//the data passes through the pipe which saves us from having to "manually" read and write all the data
      .on("data", (row) => {
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
      .on("end", async () => {
        try {
          // inserting suppliers into the database
          for (const supplier of suppliers) {
            await insertSupplier(supplier);
          }

          // entering invoices into the database
          for (const invoice of invoices) {
            //finds the corresponding supplier ID based on the supplier_internal_id
            const supplierId = await findSupplierByInternalId(
              invoice.supplier_internal_id
            );

            if (supplierId) {
              await insertInvoice(invoice, supplierId);
            }
          }

          resolve("File processed successfully");
        } catch (error) {
          reject(error.message);
        } finally {
          fs.unlinkSync(filePath); // delete the file after processing
        }
      })
      .on("error", (error) => reject(error));
  });
};

module.exports = {
  processCsvFile,
};
