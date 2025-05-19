import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Util/util";
import "./Auth.css";

const Login = ({ onLoginSuccess, navigateToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        { email, password },
        { withCredentials: true }
      );
      const { accessToken } = response.data;
      if (!accessToken) throw new Error("Token tidak ada di response");
      localStorage.setItem("accessToken", accessToken);

      // decode JWT untuk dapatkan userId
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      localStorage.setItem("userId", payload.id);

      onLoginSuccess();
    } catch (err) {
      alert(`Login gagal: ${err.response?.data?.msg || err.message}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
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
