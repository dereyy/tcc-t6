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

app.use(cookieParser());
app.use(
  cors({
    origin: "https://frontend-dea-dot-b-08-450916.uc.r.appspot.com",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);
app.use(express.json());

// Use routes
app.use("/api", GeneralRoute);
app.use("/api/user", UserRoute); // endpoints: /api/user/login, /api/user/register, etc.

// Home page
app.get("/", (req, res) => res.send("Server is running 🚀"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server berjalan di http://localhost:${PORT}`)
);
