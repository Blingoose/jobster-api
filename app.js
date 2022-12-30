import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connect.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";
import { auth } from "./middleware/authentication.js";
import authRouter from "./routes/auth.js";
import jobsRouter from "./routes/jobs.js";

//extra security packages
import helmet from "helmet";
import xss from "xss-clean";

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

dotenv.config();

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const server = express();

    // Application specific middleware
    server.use(express.static(path.resolve(__dirname, "./client/build")));
    server.use(express.json());
    server.use(helmet());
    server.use(xss());

    // Route specific middleware
    server.use("/api/v1/auth", authRouter);
    server.use("/api/v1/jobs", auth, jobsRouter);

    server.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "./client/build/index.html"));
    });

    // Not found middleware
    server.use(notFound);

    // Error handling middleware
    server.use(errorHandlerMiddleware);

    const PORT = process.env.PORT || 8000;
    http.createServer(server).listen(PORT, function () {
      console.info("Server is listening on:", this.address());
    });
  } catch (error) {
    console.log(error);
  }
};

start();
