import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Basic interceptor for logging errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      `[API ERROR]: ${error.response?.data?.message || "Server Error"}`,
    );
    return Promise.reject(error);
  },
);

export default api;
