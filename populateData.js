import { connectDB } from "./db/connect.js";
import { Job } from "./models/Job.js";
import dotenv from "dotenv";
import jobsData from "./mock-data.json" assert { type: "json" };

dotenv.config();

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Job.deleteMany();
    await Job.create(jobsData);

    console.log("Data populated successfully");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
