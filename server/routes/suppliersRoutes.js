const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/getAll", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM suppliers");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving suppliers" });
  }
});

module.exports = router;
