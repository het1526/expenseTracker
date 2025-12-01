import React, { useState } from "react";

export default function AddExpense() {
  const initial = {
    title: "",
    amount: "",
    category: "Other",
    date: "",
    note: "",
  };
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // simple validation
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.amount || Number(form.amount) <= 0)
      return setError("Amount must be > 0.");

    setError("");
    // for now just log — later we'll call createExpense(form)
    console.log("Submitting expense:", {
      ...form,
      amount: Number(form.amount),
    });
    // reset form
    setForm(initial);
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Add Expense</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 10, marginTop: 12 }}
      >
        <div>
          <label>Title</label>
          <br />
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Groceries"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <label>Amount</label>
          <br />
          <input
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="e.g., 450.50"
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <label>Category</label>
          <br />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Health</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label>Date</label>
          <br />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div>
          <label>Note (optional)</label>
          <br />
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <button
          type="submit"
          style={{ padding: "8px 12px", cursor: "pointer" }}
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
