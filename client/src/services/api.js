import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (data) => API.post("/auth/login", data);
export const getTrades = () => API.get("/trades");
export const getTradeById = (id) => API.get(`/trades/${id}`);
export const addTrade = (data) => API.post("/trades", data);
export const updateTrade = (id, data) => API.put(`/trades/${id}`, data);
export const deleteTrade = (id) => API.delete(`/trades/${id}`);
export const getSummary = () => API.get("/trades/summary");
export const searchTrades = (q = "", side = "") =>
  API.get("/trades/search", { params: { q, side } });
export const getLivePrice = (symbol) => API.get(`/live-price/${symbol}`);
export const exportTradesCsv = () =>
  API.get("/trades/export/csv", { responseType: "blob" });