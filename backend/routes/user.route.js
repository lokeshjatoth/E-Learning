import express from "express";
import { register, login, getUserProfile, logout, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/profile/update", isAuthenticated, upload.single("profilePhoto"), updateProfile);



export default router;