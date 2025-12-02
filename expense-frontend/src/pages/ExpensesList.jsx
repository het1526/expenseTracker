import React, { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "../services/expenses";

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchExpenses() {
      try {
        setLoading(true);
        const res = await getExpenses(); // axios promise
        // our backend returns { ok: true, data: [...] }
        if (!mounted) return;
        if (res.data && res.data.ok) {
          setExpenses(res.data.data || []);
        } else {
          setError((res.data && res.data.error) || "Unexpected response");
        }
      } catch (err) {
        console.error("fetchExpenses error:", err);
        setError(err?.message || "Failed to fetch expenses");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchExpenses();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteExpense(id);

      if (!res.data.ok) {
        alert(res.data.error || "Failed to delete");
        return;
      }

      // Remove the item from local state immediately
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting");
    }
  }

  return (
    <div>
      <h2>Expenses List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div style={{ color: "crimson" }}>Error: {error}</div>
      ) : (
        <table
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Title
              </th>
              <th
                style={{
                  textAlign: "right",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Amount
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Category
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Date
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: 12 }}>
                  No expenses
                </td>
              </tr>
            ) : (
              expenses.map((exp) => (
                <tr key={exp.id}>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                    {exp.title}
                  </td>
                  <td
                    style={{
                      padding: 8,
                      textAlign: "right",
                      borderBottom: "1px solid #f3f3f3",
                    }}
                  >
                    ₹{Number(exp.amount).toFixed(2)}
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                    {exp.category}
                  </td>
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                    {exp.date}
                  </td>

                  {/* EDIT BUTTON */}
                  <td style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}>
                    <button
                      style={{
                        padding: "4px 8px",
                        cursor: "pointer",
                        marginRight: 8,
                      }}
                      onClick={() => (window.location.href = `/edit/${exp.id}`)}
                    >
                      Edit
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      style={{ padding: "4px 8px", cursor: "pointer" }}
                      onClick={() => handleDelete(exp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
