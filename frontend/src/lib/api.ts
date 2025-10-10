import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://monitor-temperatura-cpd.onrender.com/api",
});

export default api;
