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

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://frontend-dea-dot-b-08-450916.uc.r.appspot.com',
  'https://fe-dea-505940949397.us-central1.run.app'
];

app.use(cookieParser());
app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  })
);

app.use(express.json());

// Health check endpoints
app.get("/", (req, res) => {
  res.json({ 
    status: "ok",
    message: "Server is running 🚀",
    timestamp: new Date().toISOString()
  });
});

app.get("/api", (req, res) => {
  res.json({ 
    status: "ok",
    message: "API is running",
    endpoints: {
      notes: "/api/notes",
      auth: "/api/user"
    },
    timestamp: new Date().toISOString()
  });
});

// Use routes
app.use("/api", GeneralRoute);
app.use("/api/user", UserRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    msg: "Terjadi kesalahan pada server",
    error: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan"
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
  console.log('CORS diaktifkan untuk:', allowedOrigins);
});
