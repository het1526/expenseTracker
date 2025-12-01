// expense-backend/controllers/expenseController.js
const db = require("../config/db");

/**
 * Create a new expense
 * Expects JSON body: { title, amount, category, date, note }
 */
exports.createExpense = async (req, res) => {
  try {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
      return res
        .status(400)
        .json({ ok: false, error: "Request body is required (JSON)." });
    }

    const { title, amount, category, date, note } = req.body;

    // basic validation
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        ok: false,
        error: "title, amount, category and date are required",
      });
    }

    // insert using parameterized query to avoid SQL injection
    const sql = `INSERT INTO expenses (title, amount, category, date, note) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      title,
      amount,
      category,
      date,
      note || null,
    ]);

    // result.insertId contains new id
    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (err) {
    console.error("createExpense error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
