import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import AuthRoute from "./route/AuthRoute.js";
import NotesRoute from "./route/Route.js";
import db from "./config/Database.js";
import Notes from "./model/NotesModel.js";

dotenv.config();
const app = express();

// Basic middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://frontend-dea-dot-b-08-450916.uc.r.appspot.com/');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Sync database
(async () => {
  try {
    await db.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    await db.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.get("/", (req, res) => res.send("Server is running 🚀"));
app.use("/api/user", AuthRoute);
app.use("/api", NotesRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "Error",
    message: "Something broke!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
