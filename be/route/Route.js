import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controller/NotesController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();
router.use(verifyToken);
router.get("/notes", getNotes);
router.post("/notes", createNote);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);
export default router;
