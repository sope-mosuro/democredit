"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = require("../Controllers/walletController");
const authMiddleware_1 = require("../Middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticateUser, walletController_1.getWallet);
exports.default = router;
