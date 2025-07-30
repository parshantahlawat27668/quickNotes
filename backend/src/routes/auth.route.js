import { Router } from "express";
import { getCurrentUser, login, loginWithGoogle, logout, register, registerWithGoogle } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/register/google").post(registerWithGoogle);
router.route("/login/google").post(loginWithGoogle);
router.route("/me").get(verifyJWT,getCurrentUser);
router.route("/logout").get(verifyJWT,logout);

export default router;
