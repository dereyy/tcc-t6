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

//endpoint akses token
router.get("/token", refreshToken);
//endpoin auth
router.post("/login", loginHandler);
router.delete("/logout", logout);

router.get("/me", Me);

//endpoint data biasa
router.post("/register", createUser); //tambah user
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.put("/edit-user/:id", verifyToken, updateUser);
router.delete("/delete-user/:id", deleteUser);

export default router;
