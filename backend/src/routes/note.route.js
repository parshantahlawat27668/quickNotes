import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createNote, deleteNote, myNotes } from "../controllers/note.controller.js";
const router = Router();

router.route("/create").post(verifyJWT,createNote);
router.route("/delete/:noteId").delete(verifyJWT,deleteNote);
router.route("/my").get(verifyJWT,myNotes);

export default router;