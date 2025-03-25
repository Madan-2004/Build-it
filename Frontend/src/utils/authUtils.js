import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/auth";

export const refreshSession = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/token/refresh/`,
      {}, // No need to manually include token in body, it should be sent via cookies
      {
        withCredentials: true, // Ensures cookies are sent
      }
    );
    console.log("Session refreshed successfully.", response.data);
    // Optionally store the access token if needed
    // localStorage.setItem("access_token", response.data.access);
    return true; // Indicate success
  } catch (error) {
    console.error("Session refresh failed:", error.response?.data || error.message);
    return false; // Indicate failure
  }
};

export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/check/`, { withCredentials: true });
    if (response.data.isAuthenticated) {
      console.log("User is authenticated");
      return true; // User is authenticated
    } else {
      console.log("User is not authenticated. Attempting to refresh session.");
      const refreshed = await refreshSession();
      return refreshed; // Return the result of the refresh attempt
    }
  } catch (error) {
    console.error("Authentication check failed:", error.response?.data || error.message);
    return false; // Indicate failure
  }
};