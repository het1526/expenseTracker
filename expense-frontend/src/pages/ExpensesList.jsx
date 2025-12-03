import React, { useEffect, useState, useMemo } from "react";
import { getExpenses, deleteExpense } from "../services/expenses";

export default function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filter / sort state
  const [monthFilter, setMonthFilter] = useState(""); // format: YYYY-MM
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc"); // date_desc, date_asc, amount_desc, amount_asc

  // pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    async function fetchExpenses() {
      try {
        setLoading(true);
        const res = await getExpenses();
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

  // Derived list of unique categories for the select
  const categories = useMemo(() => {
    const set = new Set(expenses.map((e) => e.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [expenses]);

  // Apply filters and sorting
  const filteredSorted = useMemo(() => {
    let list = [...expenses];

    // filter by month (YYYY-MM)
    if (monthFilter) {
      list = list.filter((e) => {
        const d = (e.date || "").split("T")[0];
        return d.startsWith(monthFilter);
      });
    }

    // filter by category
    if (categoryFilter && categoryFilter !== "All") {
      list = list.filter((e) => e.category === categoryFilter);
    }

    // sort
    list.sort((a, b) => {
      if (sortBy === "date_desc") {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === "date_asc") {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === "amount_desc") {
        return Number(b.amount) - Number(a.amount);
      }
      if (sortBy === "amount_asc") {
        return Number(a.amount) - Number(b.amount);
      }
      return 0;
    });

    return list;
  }, [expenses, monthFilter, categoryFilter, sortBy]);

  // --- PAGINATION: compute pages from filteredSorted ---
  const totalItems = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // ensure currentPage is valid whenever filters/pageSize change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, currentPage, pageSize]);

  // delete handler
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
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting");
    }
  }

  function resetFilters() {
    setMonthFilter("");
    setCategoryFilter("All");
    setSortBy("date_desc");
    setCurrentPage(1);
  }

  // Pagination controls helpers
  function goToPage(n) {
    const page = Math.min(Math.max(1, n), totalPages);
    setCurrentPage(page);
  }

  function renderPageButtons() {
    // show a small window of pages around current page
    const maxButtons = 7;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    const buttons = [];
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          style={{
            padding: "6px 8px",
            marginRight: 6,
            cursor: "pointer",
            background: i === currentPage ? "#222" : "#fff",
            color: i === currentPage ? "#fff" : "#222",
            border: "1px solid #ddd",
            borderRadius: 4,
          }}
        >
          {i}
        </button>
      );
    }
    return buttons;
  }

  return (
    <div>
      <h2>Expenses List</h2>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <label style={{ display: "block", fontSize: 12 }}>Month</label>
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => {
              setMonthFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: 8 }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12 }}>Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ padding: 8 }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12 }}>Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: 8 }}
          >
            <option value="date_desc">Date (newest)</option>
            <option value="date_asc">Date (oldest)</option>
            <option value="amount_desc">Amount (high → low)</option>
            <option value="amount_asc">Amount (low → high)</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <button
            onClick={resetFilters}
            style={{ padding: "8px 10px", cursor: "pointer" }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main content */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div style={{ color: "crimson", marginTop: 12 }}>Error: {error}</div>
      ) : (
        <>
          <div
            style={{
              marginTop: 12,
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              Showing <strong>{paginated.length}</strong> of{" "}
              <strong>{totalItems}</strong> expenses
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ fontSize: 12 }}>Page size</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{ padding: 6 }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: 12 }}>
                    No expenses
                  </td>
                </tr>
              ) : (
                paginated.map((exp) => (
                  <tr key={exp.id}>
                    <td
                      style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}
                    >
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
                    <td
                      style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}
                    >
                      {exp.category}
                    </td>
                    <td
                      style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}
                    >
                      {(exp.date || "").split("T")[0]}
                    </td>
                    <td
                      style={{ padding: 8, borderBottom: "1px solid #f3f3f3" }}
                    >
                      <button
                        style={{
                          padding: "4px 8px",
                          cursor: "pointer",
                          marginRight: 8,
                        }}
                        onClick={() =>
                          (window.location.href = `/edit/${exp.id}`)
                        }
                      >
                        Edit
                      </button>

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

          {/* Pagination controls */}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                style={{ padding: "6px 8px", cursor: "pointer" }}
              >
                First
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ padding: "6px 8px", cursor: "pointer" }}
              >
                Prev
              </button>

              {renderPageButtons()}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ padding: "6px 8px", cursor: "pointer" }}
              >
                Next
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                style={{ padding: "6px 8px", cursor: "pointer" }}
              >
                Last
              </button>
            </div>

            <div>
              Page {currentPage} / {totalPages}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
