// server be
import express from "express";
import cors from "cors";
import Route from "./route/Route.js";

const app = express();

app.use(cors()); //supaya server kita bisa diakses oleh fe
app.use(express.json());
app.use(Route);

app.listen(5000, () => console.log("Server telah Berjalan"));
