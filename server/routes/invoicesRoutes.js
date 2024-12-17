const express = require("express");
const db = require("../db");
const router = express.Router();

const { getAllInvoices } = require("../queries/invoiceQueries");
const {
  converted_aggregate_invoices_by_status,
  converted_overdue_invoices,
  converted_monthly_summary,
  converted_aggregate_invoices_by_company,
} = require("../services/invoiceService");

// get all invoices
router.get("/getAll", async (req, res) => {
  try {
    const result = await getAllInvoices();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving invoices" });
  }
});

// invoices summarized by status
router.get("/aggregated-by-status", async (req, res) => {
  try {
    const aggregatedData = await converted_aggregate_invoices_by_status();
    res.json(aggregatedData);
  } catch (error) {
    console.error("Error fetching aggregated data:", error);
    res.status(500).json({ error: "Failed to fetch aggregated data" });
  }
});

// // counts how many invoices are overdue and returns their information
router.get("/overdue-invoices", async (req, res) => {
  try {
    const overdueInvoices = await converted_overdue_invoices();
    res.status(200).json(overdueInvoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving data" });
  }
});

//monthly summary of invoices
router.get("/monthly-summary", async (req, res) => {
  try {
    const monthlySummary = await converted_monthly_summary();
    res.status(200).json(monthlySummary);
  } catch (error) {
    console.error("Error fetching monthly aggregated data:", error);
    res.status(500).json({ error: "Failed to fetch monthly aggregated data" });
  }
});

// get aggregated amount by the company_name or all of them
router.get("/aggregated-by-company_name", async (req, res) => {
  try {
    const { name } = req.query;
    const data = await converted_aggregate_invoices_by_company(name);
    res.json(data);
  } catch (error) {
    console.error("Error retrieving invoices:", error.message);
    res.status(error.message.includes("No invoices") ? 404 : 500).json({
      error: error.message || "Error retrieving invoices",
    });
  }
});

module.exports = router;
