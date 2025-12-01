import React, { useEffect, useState } from "react";
// import { getExpenses } from '../services/expenses' // uncomment later when backend is ready

export default function ExpensesList() {
  const mock = [
    {
      id: 1,
      title: "Groceries",
      amount: 450.5,
      category: "Food",
      date: "2025-11-25",
    },
    {
      id: 2,
      title: "Bus pass",
      amount: 120.0,
      category: "Transport",
      date: "2025-11-28",
    },
    {
      id: 3,
      title: "Coffee",
      amount: 60.0,
      category: "Food",
      date: "2025-11-30",
    },
  ];

  // eslint-disable-next-line no-unused-vars
  const [expenses, setExpenses] = useState(mock);

  // (optional) keep useEffect for future API call, but don't set state synchronously here
  useEffect(() => {
    // Future: fetch from API
    // getExpenses().then(res => setExpenses(res.data)).catch(err => console.error(err))
  }, []);

  return (
    <div>
      <h2>Expenses List</h2>

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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
