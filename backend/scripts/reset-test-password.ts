import "dotenv/config";
import mongoose from "mongoose";

import User from "../src/models/User.js";

async function resetPassword(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const newPassword = process.env.APP_PASSWORD;

  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }

  if (!newPassword) {
    throw new Error("APP_PASSWORD is missing");
  }

  await mongoose.connect(uri);

  const user = await User.findOne({
    email: "david.auth.test@example.com",
  }).select("+password");

  if (!user) {
    throw new Error("Test user not found");
  }

  user.password = newPassword;

  await user.save();

  console.log("Test user password reset successfully.");

  await mongoose.disconnect();
}

resetPassword().catch(async (error) => {
  console.error(error);

  await mongoose.disconnect();

  process.exitCode = 1;
});