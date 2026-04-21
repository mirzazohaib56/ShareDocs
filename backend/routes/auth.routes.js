import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signup,login, logout } from "../controllers/auth.controller.js";

const authRoutes = express.Router();


//  SIGNUP
authRoutes.post("/signup", signup);


//  LOGIN
authRoutes.post("/login", login);

//  LOGOUT
authRoutes.post("/logout", logout);

export default authRoutes;