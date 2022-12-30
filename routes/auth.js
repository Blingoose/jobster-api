import express from "express";
import { login, register, updateUser } from "../controllers/auth.js";
import { auth } from "../middleware/authentication.js";
import { testUser } from "../middleware/testUser.js";

const router = express.Router();

auth;
router.post("/register", register);
router.post("/login", login);
router.patch("/updateUser", auth, testUser, updateUser);

export default router;
