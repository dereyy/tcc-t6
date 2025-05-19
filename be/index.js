// server beimport express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";

// Import kedua route
import GeneralRoute from "./route/Route.js"; // <- misalnya untuk fitur umum/catatan
import UserRoute from "./route/UserRoute.js"; // <- khusus untuk auth/user

const app = express();
dotenv.config();

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Gunakan route secara eksplisit (berbeda path agar jelas)
app.use("/api", GeneralRoute);
app.use("/api/user", UserRoute); // semua endpoint user seperti /login, /register akan menjadi /api/user/login dll

// Halaman utama
app.get("/", (req, res) => res.render("index"));

// Start server
app.listen(5000, () =>
  console.log("Server telah berjalan di http://localhost:5000")
);
