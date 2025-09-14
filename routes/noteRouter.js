import express from 'express';
import {body} from "express-validator"
import { authUser } from '../middleware/authMiddleware.js';
import { createNotes, deleteNote, getNotes, getOneNote, updateNote } from '../controllers/notesController.js';

const router = express.Router();

router.post("/create", authUser, createNotes);

router.get("/getAll", authUser, getNotes);

router.get("/getOne/:id", authUser, getOneNote);

router.put("/update/:id", authUser, updateNote);

router.delete("delete/:id", authUser, deleteNote);


export default router;