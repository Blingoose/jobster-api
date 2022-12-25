import mongoose from "mongoose";

mongoose.set("strictQuery", false);

export const connectDB = (url) => {
  return mongoose.connect(url);
};
