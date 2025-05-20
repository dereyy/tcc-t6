import express from "express";
import { Register, Login, Logout } from "../controller/AuthController.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import User from "../model/UserModel.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/token", refreshToken); // ← token refresh
router.delete("/logout", Logout);

// Tambahkan route untuk mendapatkan user by ID
router.get("/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'name', 'email', 'gender'] // Hanya ambil data yang diperlukan
    });
    
    if (!user) {
      return res.status(404).json({ 
        status: "Error",
        message: "User tidak ditemukan" 
      });
    }
    
    res.json({
      status: "Success",
      ...user.toJSON() // Langsung kirim data user tanpa wrapper data
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ 
      status: "Error",
      message: "Terjadi kesalahan saat mengambil data user" 
    });
  }
});

export default router;
