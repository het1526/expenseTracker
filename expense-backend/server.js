const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/expenses", expenseRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running...");
});

// DB test route
// quick DB test route
app.get("/api/test-db", async (req, res) => {
  try {
    // try to count rows in the expenses table
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM expenses");
    return res.json({ ok: true, count: rows[0].count });
  } catch (err) {
    console.error("DB test error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
