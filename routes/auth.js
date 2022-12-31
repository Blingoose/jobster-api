import express from "express";
import { login, register, updateUser } from "../controllers/auth.js";
import { auth } from "../middleware/authentication.js";
import { testUser } from "../middleware/testUser.js";
import { rateLimit } from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log(ip);
    const ipv4 = ip.split(":").slice(-1)[0];
    const ipv6 = req.ip;
    return {
      msg: `Too many request from ip ${
        ipv4.split(".").length === 4 ? ipv4 : ipv6
      } , please try again after 15 minutes`,
    };
  },
});

const router = express.Router();

router.post("/register", register);
router.post("/login", apiLimiter, login);
router.patch("/updateUser", auth, testUser, updateUser);

export default router;
