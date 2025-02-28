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
const transactionController_1 = require("../Controllers/transactionController");
const transactionModel_1 = require("../Models/transactionModel");
const walletModel_1 = require("../Models/walletModel");
// Mock dependencies
jest.mock("../Models/transactionModel");
jest.mock("../Models/walletModel");
describe("TransactionController", () => {
    const createMockResponse = () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            sendStatus: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            jsonp: jest.fn().mockReturnThis(),
            end: jest.fn().mockReturnThis(),
        };
        return res;
    };
    describe("deposit", () => {
        it("should successfully deposit funds", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockWallet = {
                id: 1,
                user_id: 1,
                balance: 1000,
                created_at: new Date(),
            };
            walletModel_1.getWalletByUserId.mockResolvedValue(mockWallet);
            walletModel_1.updateWalletBalance.mockResolvedValue(undefined);
            transactionModel_1.createTransaction.mockResolvedValue({
                id: 1,
                wallet_id: 1,
                type: "deposit",
                amount: 500,
                created_at: new Date(),
            });
            // Create mock request and response objects
            const req = {
                body: { userId: 1, amount: 500 },
            };
            const res = createMockResponse();
            // Call the controller function directly
            yield (0, transactionController_1.deposit)(req, res);
            expect(walletModel_1.getWalletByUserId).toHaveBeenCalledWith(1);
            expect(walletModel_1.updateWalletBalance).toHaveBeenCalledWith(1, 500);
            expect(transactionModel_1.createTransaction).toHaveBeenCalledWith({
                wallet_id: 1,
                type: "deposit",
                amount: 500,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Deposit successful",
                transaction: expect.any(Object),
            });
        }));
        it("should return an error if amount is less than or equal to zero", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { userId: 1, amount: 0 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.deposit)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Amount must be greater than zero",
            });
        }));
        it("should return an error if wallet is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            walletModel_1.getWalletByUserId.mockResolvedValue(null);
            const req = {
                body: { userId: 1, amount: 500 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.deposit)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Wallet not found",
            });
        }));
        it("should handle transaction failure", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockWallet = {
                id: 1,
                user_id: 1,
                balance: 1000,
                created_at: new Date(),
            };
            walletModel_1.getWalletByUserId.mockResolvedValue(mockWallet);
            walletModel_1.updateWalletBalance.mockResolvedValue(undefined);
            transactionModel_1.createTransaction.mockRejectedValue(new Error("Transaction error"));
            const req = {
                body: { userId: 1, amount: 500 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.deposit)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Transaction failed",
            });
        }));
    });
    describe("withdraw", () => {
        it("should successfully withdraw funds", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockWallet = {
                id: 1,
                user_id: 1,
                balance: 1000,
                created_at: new Date(),
            };
            walletModel_1.getWalletByUserId.mockResolvedValue(mockWallet);
            walletModel_1.updateWalletBalance.mockResolvedValue(undefined);
            transactionModel_1.createTransaction.mockResolvedValue({
                id: 1,
                wallet_id: 1,
                type: "withdrawal",
                amount: 500,
                created_at: new Date(),
            });
            const req = {
                body: { userId: 1, amount: 500 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.withdraw)(req, res);
            expect(walletModel_1.getWalletByUserId).toHaveBeenCalledWith(1);
            expect(walletModel_1.updateWalletBalance).toHaveBeenCalledWith(1, -500);
            expect(transactionModel_1.createTransaction).toHaveBeenCalledWith({
                wallet_id: 1,
                type: "withdrawal",
                amount: 500,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Withdrawal successful",
                transaction: expect.any(Object),
            });
        }));
        it("should return an error if amount is less than or equal to zero", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { userId: 1, amount: 0 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.withdraw)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Amount must be greater than zero",
            });
        }));
        it("should return an error if wallet is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            walletModel_1.getWalletByUserId.mockResolvedValue(null);
            const req = {
                body: { userId: 1, amount: 500 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.withdraw)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Wallet not found",
            });
        }));
        it("should return an error if insufficient funds", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockWallet = {
                id: 1,
                user_id: 1,
                balance: 300,
                created_at: new Date(),
            };
            walletModel_1.getWalletByUserId.mockResolvedValue(mockWallet);
            const req = {
                body: { userId: 1, amount: 500 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.withdraw)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Insufficient funds",
            });
        }));
        it("should handle transaction failure", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockWallet = {
                id: 1,
                user_id: 1,
                balance: 1000,
                created_at: new Date(),
            };
            walletModel_1.getWalletByUserId.mockResolvedValue(mockWallet);
            walletModel_1.updateWalletBalance.mockResolvedValue(undefined);
            transactionModel_1.createTransaction.mockRejectedValue(new Error("Transaction error"));
            const req = {
                body: { userId: 1, amount: 500 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.withdraw)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Transaction failed",
            });
        }));
    });
    describe("transfer", () => {
        it("should successfully transfer funds", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockSourceWallet = {
                id: 1,
                user_id: 1,
                balance: 1000,
                created_at: new Date(),
            };
            const mockDestinationWallet = {
                id: 2,
                user_id: 2,
                balance: 500,
                created_at: new Date(),
            };
            walletModel_1.getWalletByUserId
                .mockResolvedValueOnce(mockSourceWallet)
                .mockResolvedValueOnce(mockDestinationWallet);
            walletModel_1.updateWalletBalance
                .mockResolvedValue(undefined)
                .mockResolvedValue(undefined);
            transactionModel_1.createTransaction.mockResolvedValue({
                id: 1,
                wallet_id: 1,
                type: "transfer",
                amount: 500,
                created_at: new Date(),
            });
            const req = {
                body: { userId: 1, recipientId: 2, amount: 500 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.transfer)(req, res);
            expect(walletModel_1.getWalletByUserId).toHaveBeenCalledWith(1);
            expect(walletModel_1.getWalletByUserId).toHaveBeenCalledWith(2);
            expect(walletModel_1.updateWalletBalance).toHaveBeenCalledWith(1, -500);
            expect(walletModel_1.updateWalletBalance).toHaveBeenCalledWith(2, 500);
            expect(transactionModel_1.createTransaction).toHaveBeenCalledWith({
                wallet_id: 1,
                type: "transfer",
                amount: 500,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Transfer successful",
                transaction: expect.any(Object),
            });
        }));
        it("should return an error if amount is less than or equal to zero", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: { userId: 1, recipientId: 2, amount: 0 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.transfer)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Amount must be greater than zero",
            });
        }));
        it("should return an error if sender wallet is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            walletModel_1.getWalletByUserId.mockResolvedValueOnce(null);
            const req = {
                body: { userId: 1, recipientId: 2, amount: 500 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.transfer)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Sender wallet not found",
            });
        }));
        it("should return an error if recipient wallet is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockSourceWallet = {
                id: 1,
                user_id: 1,
                balance: 1000,
                created_at: new Date(),
            };
            walletModel_1.getWalletByUserId.mockResolvedValueOnce(mockSourceWallet).mockResolvedValueOnce(null);
            const req = {
                body: { userId: 1, recipientId: 2, amount: 500 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.transfer)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: "Recipient wallet not found",
            });
        }));
        it("should return an error if insufficient funds", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockSourceWallet = {
                id: 1,
                user_id: 1,
                balance: 300,
                created_at: new Date(),
            };
            const mockDestinationWallet = {
                id: 2,
                user_id: 2,
                balance: 500,
                created_at: new Date(),
            };
            walletModel_1.getWalletByUserId
                .mockResolvedValueOnce(mockSourceWallet)
                .mockResolvedValueOnce(mockDestinationWallet);
            const req = {
                body: { userId: 1, recipientId: 2, amount: 500 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.transfer)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Insufficient funds",
            });
        }));
        it("should handle transaction failure", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockSourceWallet = {
                id: 1,
                user_id: 1,
                balance: 1000,
                created_at: new Date(),
            };
            const mockDestinationWallet = {
                id: 2,
                user_id: 2,
                balance: 500,
                created_at: new Date(),
            };
            walletModel_1.getWalletByUserId
                .mockResolvedValueOnce(mockSourceWallet)
                .mockResolvedValueOnce(mockDestinationWallet);
            walletModel_1.updateWalletBalance.mockResolvedValue(undefined);
            transactionModel_1.createTransaction.mockRejectedValue(new Error("Transaction error"));
            const req = {
                body: { userId: 1, recipientId: 2, amount: 500 },
            };
            const res = createMockResponse();
            yield (0, transactionController_1.transfer)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Transaction failed",
            });
        }));
    });
});
