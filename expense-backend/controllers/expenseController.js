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

/**
 * Delete an expense by id
 * DELETE /api/expenses/:id
 */
exports.deleteExpense = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({ ok: false, error: "Missing id parameter" });

    const [result] = await db.query("DELETE FROM expenses WHERE id = ?", [id]);

    // result.affectedRows tells us if a row was deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, error: "Expense not found" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteExpense error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * Update an expense by id
 * PUT /api/expenses/:id
 * Expects JSON body: { title, amount, category, date, note }
 */
exports.updateExpense = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    if (!id)
      return res.status(400).json({ ok: false, error: "Missing id parameter" });
    if (!body || Object.keys(body).length === 0) {
      return res
        .status(400)
        .json({ ok: false, error: "Request body is required (JSON)." });
    }

    const { title, amount, category, date, note } = body;
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        ok: false,
        error: "title, amount, category and date are required",
      });
    }

    const sql = `UPDATE expenses SET title = ?, amount = ?, category = ?, date = ?, note = ? WHERE id = ?`;
    const [result] = await db.query(sql, [
      title,
      amount,
      category,
      date,
      note || null,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, error: "Expense not found" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("updateExpense error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};

/**
 * Get a single expense by id
 * GET /api/expenses/:id
 */
exports.getExpense = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({ ok: false, error: "Missing id parameter" });

    const [rows] = await db.query(
      "SELECT id, title, amount, category, DATE_FORMAT(date, '%Y-%m-%d') AS date, note, created_at FROM expenses WHERE id = ?",
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Expense not found" });
    }

    // return the single row (not an array)
    return res.json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error("getExpense error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
