import express from "express";
import { Login, Logout, Register } from "../controller/AuthController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.delete('/logout', Logout);
router.get('/token', verifyToken, (req, res) => {
    res.json({ msg: "Token valid" });
});

export default router; 