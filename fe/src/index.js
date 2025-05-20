import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import axios from "axios";
import { API_BASE_URL } from "./Util/util";

// Konfigurasi axios
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ensure credentials are sent with every request
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 403 and we haven't tried to refresh token yet
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Access token expired, trying to refresh...");
        
        // Try to refresh token
        const response = await axios.get(`${API_BASE_URL}/user/token`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const { accessToken } = response.data;
        console.log("Got new access token");
        
        // Store new token
        localStorage.setItem("accessToken", accessToken);

        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry original request
        console.log("Retrying original request...");
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // If refresh token fails, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Render aplikasi ke root element
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
