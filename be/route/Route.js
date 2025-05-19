import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controller/NotesController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/notes", verifyToken, getNotes);
router.post("/notes", verifyToken, createNote);
router.put("/notes/:id", verifyToken, updateNote);
router.delete("/notes/:id", verifyToken, deleteNote);

export default router;
