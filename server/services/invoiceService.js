const {
  getAllAggregatedInvoicesByStatus,
  getAllOverdueInvoices,
  getAllMonthlySummary,
  getInvoicesByCompanyName,
} = require("../queries/invoiceQueries");

const exchangeRates = {
  USD: 3.6, // USD to shekels
  EUR: 3.78, // EUR to shekels
  ILS: 1, // shekel
};

const converter = (invoice) => {
  const rate = exchangeRates[invoice.invoice_currency] || exchangeRates.ILS;
  return invoice.invoice_cost * rate;
};

// Function for processing invoices and calculating amounts by status
const converted_aggregate_invoices_by_status = async () => {
  const invoices = await getAllAggregatedInvoicesByStatus(); // Calling the query from the queries file

  // this object will contain the final amount of aggregated data
  const aggregatedData = {};

  // for each row we choosing the rate by the currency and converting to shekel
  invoices.forEach((invoice) => {
    const costInShekel = converter(invoice);

    // after we converted the currency we will add the amount converted
    // to shekels into the existing amount for the status.
    if (!aggregatedData[invoice.invoice_status]) {
      aggregatedData[invoice.invoice_status] = 0;
    }
    aggregatedData[invoice.invoice_status] += costInShekel;
  });

  // returning the aggregatedData object as an array of [key, value] pairs
  //key (status) and value (aggregated amount)
  return Object.entries(aggregatedData).map(([status, totalAmount]) => ({
    invoice_status: status,
    total_amount: totalAmount.toFixed(2),
  }));
};

// converting the amounts of each invoice to the currency shekels (invoice_cost)
// by using exchange rates (exchangeRates)
const converted_overdue_invoices = async () => {
  result = await getAllOverdueInvoices();

  // convert amounts to shekels
  //result.rows[0] - there is only one row because the query returns a JSON object
  const transformedDetails = result.rows[0].details.map((invoice) => {
    const costInShekel = converter(invoice);
    // rturn an object
    return {
      ...invoice, // spread all the fields to the object
      invoice_cost: costInShekel.toFixed(2), // convert to shekels and save with 2 digits after the point
    };
  });

  return [
    {
      overdue_count: result.rows[0].overdue_count,
      details: transformedDetails,
    },
  ];
};

// converts amounts by dates
const converted_monthly_summary = async () => {
  const monthlySummary = await getAllMonthlySummary();
  const monthlyData = {}; //an empty object that will be used to store monthly amounts by key <year-month>.

  monthlySummary.forEach((invoice) => {
    const costInShekel = converter(invoice);

    //creating a unique key for each month and year
    const key = `${invoice.year}-${invoice.month}`;

    if (!monthlyData[key]) {
      monthlyData[key] = 0; //for example monthlyData = { "2024-1": 0 }
    }
    monthlyData[key] += costInShekel;
  });

  // Object.entries(monthlyData) -> converts the monthlyData object to an array of [key, value] pairs
  //for example:
  //if monthlyData = { "2024-1": 4900, "2024-2": 1750 }, then: [["2024-1", 4900], ["2024-2", 1750]]
  return Object.entries(monthlyData).map(([key, totalAmount]) => ({
    month: key.split("-")[1],
    year: key.split("-")[0],
    total_amount: totalAmount.toFixed(2),
  }));
};

// Invoice processing and cost summary by company name
const converted_aggregate_invoices_by_company = async (companyName) => {
  const invoices = await getInvoicesByCompanyName(companyName);

  if (invoices.length === 0) {
    throw new Error("No invoices found for the given company");
  }
  const results = {};

  // Processing the invoices
  invoices.forEach((invoice) => {
    const costInILS = converter(invoice);

    // If the name does not yet exist in the object,
    // create it and initialize it with 0, if it exists, then we will just add more amounts to it
    if (!results[invoice.supplier_company_name]) {
      results[invoice.supplier_company_name] = 0;
    }
    results[invoice.supplier_company_name] += costInILS;
  });

  // return the result in a convenient format
  return Object.entries(results).map(([company, total]) => ({
    supplier_company_name: company,
    total_cost_ils: total,
  }));
};

module.exports = {
  converted_aggregate_invoices_by_status,
  converted_overdue_invoices,
  converted_monthly_summary,
  converted_aggregate_invoices_by_company,
};
