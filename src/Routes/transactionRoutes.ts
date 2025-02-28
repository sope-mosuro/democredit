import express from "express";
import { deposit, withdraw, transfer } from "../Controllers/transactionController";
import { authenticateUser } from "../Middlewares/authMiddleware";

const router = express.Router();

router.post("/deposit", authenticateUser, deposit);
router.post("/withdraw", authenticateUser, withdraw);
router.post("/transfer", authenticateUser, transfer);


export default router;
