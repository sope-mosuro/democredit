"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWallet = void 0;
const walletModel_1 = require("../Models/walletModel");
/**
 * @desc Get the authenticated user's wallet
 * @route GET /api/wallet
 * @access Private (Authenticated)
 */
const getWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        // Check if wallet exists for user; if not, create a new one
        let wallet = yield (0, walletModel_1.getWalletByUserId)(userId);
        if (!wallet)
            wallet = yield (0, walletModel_1.createWallet)(userId);
        return res.status(200).json({ wallet });
    }
    catch (error) {
        return res.status(500).json({ message: "Error retrieving wallet" });
    }
});
exports.getWallet = getWallet;
