// expense-backend/routes/expenseRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

const {
  createExpense,
  deleteExpense,
  updateExpense,
  getExpense,
} = require("../controllers/expenseController");

// POST /api/expenses  -> create a new expense
router.post("/", createExpense);

// GET /api/expenses -> list all expenses
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, title, amount, category, DATE_FORMAT(date, '%Y-%m-%d') AS date, note, created_at FROM expenses ORDER BY date DESC"
    );
    return res.json({ ok: true, data: rows });
  } catch (err) {
    console.error("getExpenses error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/expenses/recent -> last 5 expenses
router.get("/recent", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, title, amount, category, DATE_FORMAT(date, '%Y-%m-%d') AS date FROM expenses ORDER BY date DESC LIMIT 5"
    );
    return res.json({ ok: true, data: rows });
  } catch (err) {
    console.error("recent expenses error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/expenses/summary/monthly
router.get("/summary/monthly", async (req, res) => {
  try {
    // total for current month
    const [totalRows] = await db.query(
      "SELECT IFNULL(SUM(amount),0) AS total FROM expenses WHERE MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE())"
    );

    // category-wise totals for current month
    const [catRows] = await db.query(
      "SELECT category, IFNULL(SUM(amount),0) AS total FROM expenses WHERE MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE()) GROUP BY category"
    );

    return res.json({
      ok: true,
      total: totalRows[0].total,
      byCategory: catRows,
    });
  } catch (err) {
    console.error("monthly summary error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// DELETE /api/expenses/:id -> delete an expense
router.delete("/:id", deleteExpense);

// PUT /api/expenses/:id -> update an expense
router.put("/:id", updateExpense);

// GET /api/expenses/:id -> get a single expense
router.get("/:id", getExpense);

module.exports = router;
