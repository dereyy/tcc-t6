import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import AuthRoute from "./route/AuthRoute.js";
import NotesRoute from "./route/Route.js";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://frontend-dea-dot-b-08-450916.uc.r.appspot.com",
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => res.send("Server is running 🚀"));
app.use("/api/user", AuthRoute);
app.use("/api", NotesRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
