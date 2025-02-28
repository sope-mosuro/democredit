"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = require("../Controllers/transactionController");
const authMiddleware_1 = require("../Middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/deposit", authMiddleware_1.authenticateUser, transactionController_1.deposit);
router.post("/withdraw", authMiddleware_1.authenticateUser, transactionController_1.withdraw);
router.post("/transfer", authMiddleware_1.authenticateUser, transactionController_1.transfer);
exports.default = router;
