// Konfigurasi API URL
const isDevelopment = process.env.NODE_ENV === 'development';
export const API_BASE_URL = isDevelopment 
  ? "http://localhost:5000/api"
  : "https://be-dea-505940949397.us-central1.run.app/api";

// Fungsi untuk mengecek koneksi ke API
export const checkApiConnection = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    return response.ok;
  } catch (error) {
    console.error("Error checking API connection:", error);
    return false;
  }
};

// Fungsi untuk mengecek apakah token sudah expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

// Fungsi untuk refresh token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Refresh token tidak ditemukan");

    const response = await fetch(`${API_BASE_URL}/user/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error("Gagal refresh token");

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};
