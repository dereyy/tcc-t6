import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  loginHandler,
  logout,
} from "../controller/UserController.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { Me } from "../controller/UserController.js";

const router = express.Router();

// Auth endpoints
router.post("/login", loginHandler);
router.post("/refresh-token", refreshToken);
router.delete("/logout", logout);
router.get("/me", Me);

// User management endpoints
router.post("/register", createUser);
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.put("/edit-user/:id", verifyToken, updateUser);
router.delete("/delete-user/:id", deleteUser);

export default router;
