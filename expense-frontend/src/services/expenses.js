// src/services/expenses.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Expense API calls (stubs) — returns axios Promises
export const getExpenses = () => API.get("/expenses");
export const getExpense = (id) => API.get(`/expenses/${id}`);
export const createExpense = (payload) => API.post("/expenses", payload);
export const updateExpense = (id, payload) =>
  API.put(`/expenses/${id}`, payload);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
// get monthly summary for dashboard
export const getMonthlySummary = () => API.get("/expenses/summary/monthly");
export const getRecentExpenses = () => API.get("/expenses/recent");
