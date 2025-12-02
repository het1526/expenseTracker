import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExpense, updateExpense } from "../services/expenses";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Other",
    date: "",
    note: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await getExpense(id);
        if (!mounted) return;

        if (res.data && res.data.ok) {
          const row = res.data.data; // make sure your GET /api/expenses/:id returns { ok:true, data: { ... } }
          // some backends return the row inside an array; handle both shapes
          const expense = Array.isArray(row) ? row[0] : row;

          if (!expense) {
            setError("Expense not found");
            return;
          }

          setForm({
            title: expense.title || "",
            amount: expense.amount != null ? String(expense.amount) : "",
            category: expense.category || "Other",
            date: expense.date ? expense.date.split("T")[0] : "", // keep yyyy-mm-dd
            note: expense.note || "",
          });
        } else {
          setError((res.data && res.data.error) || "Failed to load expense");
        }
      } catch (err) {
        console.error("load expense error", err);
        setError(err.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.amount || Number(form.amount) <= 0)
      return setError("Amount must be > 0.");

    setError("");
    try {
      const payload = { ...form, amount: Number(form.amount) };
      const res = await updateExpense(id, payload);

      if (!res.data.ok) {
        setError(res.data.error || "Failed to update");
        return;
      }

      // navigate back to list
      navigate("/expenses");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  }

  if (loading) return <p>Loading expense...</p>;

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Edit Expense</h2>

      {error && (
        <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>
      )}

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

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/expenses")}
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
