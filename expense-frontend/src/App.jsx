import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ExpensesList from "./pages/ExpensesList";
import AddExpense from "./pages/addExpense";
import EditExpense from "./pages/EditExpense";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <nav>
          <Link to="/" style={{ marginRight: 12 }}>
            Dashboard
          </Link>
          <Link to="/expenses">Expenses</Link> {/* placeholder link */}
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpensesList />} />
          <Route path="/add" element={<AddExpense />} />
          <Route path="/edit/:id" element={<EditExpense />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
