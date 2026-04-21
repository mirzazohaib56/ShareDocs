import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signup,login } from "../controllers/auth.controller.js";

const authRoutes = express.Router();


//  SIGNUP
authRoutes.post("/signup", signup);


//  LOGIN
authRoutes.post("/login", login);

export default authRoutes;