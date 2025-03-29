import express from "express";
import { getNotes, createNote, updateNote, deleteNote } from "../controller/NotesController.js";

const router = express.Router();

router.get("/notes", getNotes);
router.post("/tambah-note", createNote);
router.put("/edit-note/:id", updateNote);
router.delete("/hapus-note/:id", deleteNote);

export default router;
