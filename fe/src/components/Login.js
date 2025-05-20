import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Util/util";
import "./Auth.css";

const Login = ({ onLoginSuccess, navigateToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      console.log("Attempting login to:", `${API_BASE_URL}/user/login`);
      
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        { email, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Login response:", response.data);

      // Cek status response
      if (response.data.status === "Success") {
        const { accessToken, user } = response.data;
        
        if (!accessToken) {
          throw new Error("Token tidak ada di response");
        }
        
        // Store token and user data
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("user", JSON.stringify(user));
        
        onLoginSuccess();
      } else {
        throw new Error(response.data.message || "Login gagal");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.message || "Server error: " + err.response.status);
      } else if (err.request) {
        // No response received
        setError("Tidak dapat terhubung ke server. Pastikan server berjalan.");
      } else {
        // Other errors
        setError(err.message || "Terjadi kesalahan saat login");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="form-button">
            Login
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Belum punya akun?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigateToRegister();
              }}
            >
              Daftar di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
