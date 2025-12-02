// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getMonthlySummary } from "../services/expenses";
import { getRecentExpenses } from "../services/expenses";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [summary, setSummary] = useState({ total: 0, byCategory: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await getMonthlySummary();
        if (!mounted) return;
        if (res.data && res.data.ok) {
          setSummary({
            total: res.data.total || 0,
            byCategory: res.data.byCategory || [],
          });
        } else {
          setError((res.data && res.data.error) || "Unexpected response");
        }
      } catch (err) {
        console.error("monthly summary load error", err);
        setError(err.message || "Failed to load summary");
      } finally {
        if (mounted) setLoading(false);
      }
      // load recent expenses
      try {
        const recentRes = await getRecentExpenses();
        if (recentRes.data && recentRes.data.ok) {
          setRecent(recentRes.data.data || []);
        }
      } catch (err) {
        console.error("recent load error:", err);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Prepare data for pie chart
  const labels = summary.byCategory.map((c) => c.category);
  const data = {
    labels,
    datasets: [
      {
        label: "Category spend",
        data: summary.byCategory.map((c) => Number(c.total)),
        // Do not set colors explicitly (per project/tooling guidance)
        // Chart will choose defaults.
      },
    ],
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <h2>Dashboard</h2>

      {loading ? (
        <p>Loading summary...</p>
      ) : error ? (
        <div style={{ color: "crimson" }}>Error: {error}</div>
      ) : (
        <>
          <section style={{ marginTop: 12, marginBottom: 18 }}>
            <h3>Total this month</h3>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                marginTop: 6,
              }}
            >
              ₹{Number(summary.total).toFixed(2)}
            </div>
          </section>

          <section
            style={{ display: "flex", gap: 24, alignItems: "flex-start" }}
          >
            <div style={{ width: 360 }}>
              <h4>Spend by category</h4>
              {labels.length === 0 ? (
                <p>No category data for this month.</p>
              ) : (
                <Pie data={data} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <h4>Recent (Top 5)</h4>
              <p>
                Below is a quick snapshot — we will wire the "recent" endpoint
                next (if not done).
              </p>
              {/* placeholder for recent list; we'll fetch /api/expenses/recent in a later tiny step */}
              <div style={{ marginTop: 8 }}>
                {recent.length === 0 ? (
                  <p>No recent expenses.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {recent.map((item) => (
                      <li key={item.id} style={{ marginBottom: 6 }}>
                        <strong>{item.title}</strong> — ₹
                        {Number(item.amount).toFixed(2)}
                        <div style={{ fontSize: 12, color: "#666" }}>
                          {item.category} • {item.date}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
