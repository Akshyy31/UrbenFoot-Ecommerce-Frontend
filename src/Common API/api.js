import axios from "axios";
import { refreshTokenApi } from "../services/userServices";

const api = axios.create({
  baseURL: "https://urbenfoot.duckdns.org",                          // Django backend
      //  withCredentials: true,  //                            // include cookies (for CSRF/session)
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",                    //  Django AJAX check
  },
});

//  Helper to read CSRF cookie (for POST requests)
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Refresh access token safely
const refreshAccessToken = async () =>  {
  try {
    const data = await refreshTokenApi();
    return data.access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";                          // redirect if refresh fails
    return null;
  }
};

//  Attach JWT and CSRF before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const csrfToken = getCookie("csrftoken");
    if (csrfToken) config.headers["X-CSRFToken"] = csrfToken;

    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token when expired (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccess = await refreshAccessToken();
      if (newAccess) {
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest); // Retry original request
      }
    }

    return Promise.reject(error);
  }
);

export default api;
