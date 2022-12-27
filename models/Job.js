import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxLength: 50,
      lowercase: true,
    },

    position: {
      type: String,
      required: [true, "Please provide position"],
      maxLength: 100,
    },

    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      defult: "full-time",
    },

    jobLocation: {
      type: String,
      default: "myCity",
      required: true,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", JobSchema);
