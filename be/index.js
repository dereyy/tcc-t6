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

// CORS configuration
const corsOptions = {
  origin: [
    'https://frontend-dea-dot-b-08-450916.uc.r.appspot.com',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => res.send("Server is running 🚀"));
app.use("/api/user", AuthRoute);
app.use("/api", NotesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
