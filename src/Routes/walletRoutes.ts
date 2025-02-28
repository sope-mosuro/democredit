import express from "express";
import { getWallet } from "../Controllers/walletController";
import { authenticateUser } from "../Middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticateUser, getWallet);

export default router;
