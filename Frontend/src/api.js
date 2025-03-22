import axios from "axios";

const API_URL = "http://localhost:8000/api/"; // Replace with actual API URL

// ✅ Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensures cookies are sent
});

// ✅ Flag to prevent multiple refresh calls at once
let isRefreshing = false;

// ✅ Function to refresh session
const refreshSession = async () => {
  try {
    console.log("Attempting to refresh session...");
    const response = await axios.post(`${API_URL}/auth/token/refresh/`, {}, { withCredentials: true });
    console.log("Session refreshed successfully.", response.data);
    return true;
  } catch (error) {
    console.error("Session refresh failed:", error.response?.data || error.message);
    return false;
  }
};

// ✅ Attach Axios interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response, // Pass successful responses through
  async (error) => {
    if (error.response?.status === 401 && !isRefreshing) {
      isRefreshing = true;

      const refreshed = await refreshSession();
      isRefreshing = false;

      if (refreshed) {
        console.log("Retrying failed request after session refresh...");
        return api(error.config); // Retry original request
      }
    }

    return Promise.reject(error);
  }
);

export default api;
