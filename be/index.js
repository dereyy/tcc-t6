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

app.use(cookieParser());
app.use(express.json());

// Update CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://frontend-dea-dot-b-08-450916.uc.r.appspot.com",
      "https://frontend-dea.uc.r.appspot.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400 // 24 hours
  })
);

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

app.get("/", (req, res) => res.send("Server is running 🚀"));
app.use("/api/user", AuthRoute);
app.use("/api", NotesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
