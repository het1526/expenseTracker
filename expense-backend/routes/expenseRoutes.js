// expense-backend/routes/expenseRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

const { createExpense } = require("../controllers/expenseController");

// POST /api/expenses  -> create a new expense
router.post("/", createExpense);

// GET /api/expenses -> list all expenses
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM expenses ORDER BY date DESC");
    return res.json({ ok: true, data: rows });
  } catch (err) {
    console.error("getExpenses error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
