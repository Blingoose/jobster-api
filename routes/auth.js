import express from "express";
import { login, register, updateUser } from "../controllers/auth.js";
import { auth } from "../middleware/authentication.js";
const router = express.Router();

auth;
router.post("/register", register);
router.post("/login", login);
router.patch("/updateUser", auth, updateUser);

export default router;
