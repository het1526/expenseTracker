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

// DELETE /api/expenses/:id -> delete an expense
router.delete("/:id", deleteExpense);

// PUT /api/expenses/:id -> update an expense
router.put("/:id", updateExpense);

// GET /api/expenses/:id -> get a single expense
router.get("/:id", getExpense);

module.exports = router;
