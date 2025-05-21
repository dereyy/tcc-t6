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
