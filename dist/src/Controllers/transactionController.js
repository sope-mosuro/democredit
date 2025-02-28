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
exports.transfer = exports.withdraw = exports.deposit = void 0;
const transactionModel_1 = require("../Models/transactionModel");
const walletModel_1 = require("../Models/walletModel");
/**
 * @desc Deposit funds into the user's wallet
 * @route POST /api/transactions/deposit
 * @access Private (Authenticated)
 */
const deposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const { amount } = req.body;
        if (amount <= 0)
            return res.status(400).json({ message: "Amount must be greater than zero" });
        const wallet = yield (0, walletModel_1.getWalletByUserId)(userId);
        if (!wallet)
            return res.status(404).json({ message: "Wallet not found" });
        yield (0, walletModel_1.updateWalletBalance)(wallet.id, amount);
        const transaction = yield (0, transactionModel_1.createTransaction)({ wallet_id: wallet.id, type: "deposit", amount });
        return res.status(200).json({ message: "Deposit successful", transaction });
    }
    catch (error) {
        return res.status(500).json({ message: "Transaction failed" });
    }
});
exports.deposit = deposit;
/**
 * @desc Withdraw funds from the user's wallet
 * @route POST /api/transactions/withdraw
 * @access Private (Authenticated)
 */
const withdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const { amount } = req.body;
        if (amount <= 0)
            return res.status(400).json({ message: "Amount must be greater than zero" });
        const wallet = yield (0, walletModel_1.getWalletByUserId)(userId);
        if (!wallet)
            return res.status(404).json({ message: "Wallet not found" });
        if (wallet.balance < amount)
            return res.status(400).json({ message: "Insufficient funds" });
        yield (0, walletModel_1.updateWalletBalance)(wallet.id, -amount);
        const transaction = yield (0, transactionModel_1.createTransaction)({ wallet_id: wallet.id, type: "withdrawal", amount });
        return res.status(200).json({ message: "Withdrawal successful", transaction });
    }
    catch (error) {
        return res.status(500).json({ message: "Transaction failed" });
    }
});
exports.withdraw = withdraw;
/**
 * @desc Transfer funds from one wallet to another
 * @route POST /api/transactions/transfer
 * @access Private (Authenticated)
 */
const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const { recipientId, amount } = req.body;
        if (amount <= 0)
            return res.status(400).json({ message: "Amount must be greater than zero" });
        const senderWallet = yield (0, walletModel_1.getWalletByUserId)(userId);
        const recipientWallet = yield (0, walletModel_1.getWalletByUserId)(recipientId);
        if (!senderWallet)
            return res.status(404).json({ message: "Sender wallet not found" });
        if (!recipientWallet)
            return res.status(404).json({ message: "Recipient wallet not found" });
        if (senderWallet.balance < amount)
            return res.status(400).json({ message: "Insufficient funds" });
        yield (0, walletModel_1.updateWalletBalance)(senderWallet.id, -amount);
        yield (0, walletModel_1.updateWalletBalance)(recipientWallet.id, amount);
        const transaction = yield (0, transactionModel_1.createTransaction)({ wallet_id: senderWallet.id, type: "transfer", amount });
        return res.status(200).json({ message: "Transfer successful", transaction });
    }
    catch (error) {
        return res.status(500).json({ message: "Transaction failed" });
    }
});
exports.transfer = transfer;
