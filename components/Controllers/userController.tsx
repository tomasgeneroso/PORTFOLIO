"use client";
import dotenv from "dotenv";
import UserModel from "@/DB/models&Schemas";
import { User } from "@/types";
import mongoose from "mongoose";
dotenv.config();
const userUrl = true; // Cambiarlo por la URL
const userController = {
  getUserData: async () => {
    try {
      const response = await UserModel.find();
      console.log("🚀 ~ getUserData: ~ response:", response);
      return response;
    } catch (error) {
      console.log("🚀 ~ getUserData: ~ error:", error);
      return error;
    }
  },
  postUserData: async (userData: User) => {
    try {
      if (mongoose.models && mongoose.models.User) {
        const keysUsermodel = Object.keys(userData);
        const user = new UserModel(userData);
        console.log("🚀 ~ postUserData: ~ user:", user);
        const saved = await user
          .save()
          .then(() => console.log("User saved successfully!", user))
          .catch((err: any) => console.error("Error saving user:", err));
        console.log("🚀 ~ postUserData: ~ saved:", saved);
        return saved;
      } else {
      }
    } catch (error) {
      console.error("Error posting user data:", error);
      throw new Error("Failed to post user data");
    }
  },
};

export default userController;
