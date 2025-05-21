// Server backend
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Import routes
import GeneralRoute from "./route/Route.js"; // untuk fitur umum/catatan
import UserRoute from "./route/UserRoute.js"; // untuk auth/user

const app = express();
dotenv.config();

// Middleware untuk logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://frontend-dea-dot-b-08-450916.uc.r.appspot.com"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());

// Use routes
app.use("/api", GeneralRoute);
app.use("/api/user", UserRoute); // endpoints: /api/user/login, /api/user/register, etc.

// Home page
app.get("/", (req, res) => res.send("Server is running 🚀"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    msg: "Terjadi kesalahan pada server",
    error: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log('CORS diaktifkan untuk:', ['http://localhost:3000', 'https://frontend-dea-dot-b-08-450916.uc.r.appspot.com']);
});
