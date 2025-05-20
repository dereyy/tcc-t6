import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import axios from "axios";
import { API_BASE_URL } from "./Util/util";

// Konfigurasi axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add request interceptor
axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;
    
    // Debug request
    console.log('=== Request Config ===');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Headers:', config.headers);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axios.interceptors.response.use(
  (response) => {
    // Debug response
    console.log('=== Response Success ===');
    console.log('URL:', response.config.url);
    console.log('Status:', response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Debug error
    console.log('=== Response Error ===');
    console.log('URL:', originalRequest.url);
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);

    // Jika request adalah untuk refresh token, jangan coba refresh lagi
    if (originalRequest.url === '/user/token') {
      console.log('Refresh token request failed, redirecting to login');
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      window.location.href = '/';
      return Promise.reject(error);
    }

    // If error is 401/403 and we haven't tried to refresh token yet
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        // Jika sedang dalam proses refresh, tambahkan request ke queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Access token expired, trying to refresh...");
        
        // Try to refresh token
        const response = await axios.get("/user/token", {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log("Refresh token response:", response.data);
        const { accessToken } = response.data;
        
        if (!accessToken) {
          throw new Error("No access token received");
        }

        // Store new token
        localStorage.setItem("accessToken", accessToken);
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Process queued requests
        processQueue(null, accessToken);
        
        // Retry original request
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError.response?.data || refreshError.message);
        
        // Process queued requests with error
        processQueue(refreshError, null);
        
        // Clear all auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        
        // Redirect to login with error message
        const errorMessage = refreshError.response?.data?.message || "Session expired, please login again";
        window.location.href = `/?error=${encodeURIComponent(errorMessage)}`;
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
