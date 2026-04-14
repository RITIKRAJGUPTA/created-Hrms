// src/utils/api.js
import axios from "axios";
const api = axios.create({ baseURL: " https://hrms-6s7f.onrender.com/api" });
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export default api;
