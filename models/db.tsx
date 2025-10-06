import { User } from "@/types/index";
import mongoose from "mongoose";
const { Schema } = mongoose;

const LinksSchema = new Schema({
  Github: String,
  Linkedin: String,
  Gmail: String,
  userId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
});
const SkillsSchema = new Schema({
  name: String,
  icono: String,
  level: Number,
  color: String,
});
const ProjectSchema = new Schema({
  projectName: String,
  enterpriseicono: String,
  projectImage: String,
  date: Date,
  description: String,
  technologies: [String],
  link: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});
const TestimoniesSchema = new Schema({
  author: String,
  photo: String,
  testimonial: String,
  projectLink: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});
const UserSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String },
  aboutMe: { type: String },
  testimonies: [TestimoniesSchema],
  links: LinksSchema,
  skills: [SkillsSchema],
  projects: [ProjectSchema],
});

export default mongoose.model("User", UserSchema);
