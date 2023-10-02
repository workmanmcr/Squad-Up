import express from "express";
import { getUser, getAllUsers, updateUser } from "../controllers/user.js";

const router = express.Router();

// Get a user by ID
router.get("/find/:userId", getUser);

// Get all users
router.get("/all", getAllUsers);

// Update a user
router.put("/", updateUser);

export default router;
