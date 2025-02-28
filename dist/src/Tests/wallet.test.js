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
const walletController_1 = require("../Controllers/walletController");
const walletModel_1 = require("../Models/walletModel");
// Mock dependencies
jest.mock("../Models/walletModel");
describe("WalletController", () => {
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
    describe("getWallet", () => {
        it("should successfully retrieve wallet details", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockWallet = {
                id: 1,
                user_id: 1,
                balance: 1000,
                created_at: new Date(),
            };
            walletModel_1.getWalletByUserId.mockResolvedValue(mockWallet);
            // Create mock request and response objects
            const req = {
                body: { userId: 1 },
            };
            const res = createMockResponse();
            // Call the controller function directly
            yield (0, walletController_1.getWallet)(req, res);
            expect(walletModel_1.getWalletByUserId).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ wallet: mockWallet });
        }));
        it("should create a new wallet if none exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockWallet = {
                id: 1,
                user_id: 1,
                balance: 0,
                created_at: new Date(),
            };
            walletModel_1.getWalletByUserId.mockResolvedValue(null);
            walletModel_1.createWallet.mockResolvedValue(mockWallet);
            // Create mock request and response objects
            const req = {
                body: { userId: 1 },
            };
            const res = createMockResponse();
            // Call the controller function directly
            yield (0, walletController_1.getWallet)(req, res);
            expect(walletModel_1.getWalletByUserId).toHaveBeenCalledWith(1);
            expect(walletModel_1.createWallet).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ wallet: mockWallet });
        }));
        it("should handle wallet retrieval failure", () => __awaiter(void 0, void 0, void 0, function* () {
            walletModel_1.getWalletByUserId.mockRejectedValue(new Error("Database error"));
            // Create mock request and response objects
            const req = {
                body: { userId: 1 },
            };
            const res = createMockResponse();
            // Call the controller function directly
            yield (0, walletController_1.getWallet)(req, res);
            expect(walletModel_1.getWalletByUserId).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error retrieving wallet" });
        }));
    });
});
