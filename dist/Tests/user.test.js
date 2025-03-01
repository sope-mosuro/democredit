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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../Controllers/userController");
const userModel_1 = require("../Models/userModel");
const adjutorServices_1 = require("../Services/adjutorServices");
const walletModel_1 = require("../Models/walletModel");
const authService_1 = __importDefault(require("../Services/authService"));
// Mock dependencies
jest.mock("../Models/userModel");
jest.mock("../Services/adjutorServices");
jest.mock("../Services/authService");
jest.mock("../Models/walletModel");
describe("UserController", () => {
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
    describe("registerUser", () => {
        it("should successfully register a user, create a wallet, and update blacklist status", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                phone: "1234567890",
                bvn: "12345678901",
                created_at: new Date(),
            };
            const mockWallet = {
                id: 1,
                user_id: 1,
                balance: 0,
                created_at: new Date(),
            };
            const mockRiskResult = {
                isRisky: false,
                reason: "",
            };
            const mockToken = "mockToken";
            adjutorServices_1.checkUserRisk.mockResolvedValue(mockRiskResult);
            userModel_1.createUser.mockResolvedValue(mockUser);
            userModel_1.updateUserBlacklistStatus.mockResolvedValue(undefined);
            walletModel_1.createWallet.mockResolvedValue(mockWallet);
            authService_1.default.generateToken.mockReturnValue(mockToken);
            const req = {
                body: {
                    name: "John Doe",
                    email: "john@example.com",
                    phone: "1234567890",
                    bvn: "12345678901",
                },
            };
            const res = createMockResponse();
            yield (0, userController_1.registerUser)(req, res);
            expect(adjutorServices_1.checkUserRisk).toHaveBeenCalledWith("john@example.com");
            expect(userModel_1.createUser).toHaveBeenCalledWith({
                name: "John Doe",
                email: "john@example.com",
                phone: "1234567890",
                bvn: "12345678901",
            });
            expect(userModel_1.updateUserBlacklistStatus).toHaveBeenCalledWith(1, false);
            expect(walletModel_1.createWallet).toHaveBeenCalledWith(1);
            expect(authService_1.default.generateToken).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "User registered",
                user: mockUser,
                wallet: mockWallet,
                token: mockToken,
            });
        }));
        it("should handle blacklisted user registration", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockRiskResult = {
                isRisky: true,
                reason: "High risk due to past due loans",
            };
            adjutorServices_1.checkUserRisk.mockResolvedValue(mockRiskResult);
            userModel_1.createUser.mockResolvedValue(null); // Simulate that user creation fails
            const req = {
                body: {
                    name: "Jane Doe",
                    email: "jane@example.com",
                    phone: "0987654321",
                    bvn: "98765432101",
                },
            };
            const res = createMockResponse();
            yield (0, userController_1.registerUser)(req, res);
            expect(adjutorServices_1.checkUserRisk).toHaveBeenCalledWith("jane@example.com");
            expect(userModel_1.createUser).not.toHaveBeenCalled(); // User should not be created
            expect(userModel_1.updateUserBlacklistStatus).not.toHaveBeenCalled(); // No update to blacklist status
            expect(walletModel_1.createWallet).not.toHaveBeenCalled(); // Wallet should not be created
            expect(res.status).toHaveBeenCalledWith(400); // Assuming we want to return a 400 status for blacklisted users
            expect(res.json).toHaveBeenCalledWith({
                message: "User is blacklisted and cannot be registered",
                reason: "High risk due to past due loans",
            });
        }));
        it("should handle user registration failure", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: {
                    name: "John Doe",
                    email: "john@example.com",
                    phone: "1234567890",
                    bvn: "12345678901",
                },
            };
            const res = createMockResponse();
            adjutorServices_1.checkUserRisk.mockRejectedValue(new Error("Risk check failed"));
            yield (0, userController_1.registerUser)(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error registering user" });
        }));
    });
});
