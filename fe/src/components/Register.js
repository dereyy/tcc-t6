import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../Util/util";
import "./Auth.css";

const Register = ({ onRegisterSuccess, navigateToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/user/register`, {
        name,
        email,
        gender,
        password,
      });
      alert("Registrasi berhasil! Silakan login.");
      onRegisterSuccess();
    } catch (err) {
      alert(`Registrasi gagal: ${err.response?.data?.msg || err.message}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div className="form-field">
            <label>Nama</label>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <label>Jenis Kelamin</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
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
            Register
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Sudah punya akun?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigateToLogin();
              }}
            >
              Login di sini
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
