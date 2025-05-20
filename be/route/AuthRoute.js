import express from "express";
import { Register, Login, Logout } from "../controller/AuthController.js";
import { refreshToken } from "../controller/RefreshToken.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken); // ← token refresh
router.delete("/logout", Logout);

export default router;
