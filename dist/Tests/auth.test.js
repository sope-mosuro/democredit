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
const authMiddleware_1 = require("../Middlewares/authMiddleware");
const authService_1 = __importDefault(require("../Services/authService"));
// Mock the AuthService
jest.mock("../Services/authService");
describe("Auth Middleware", () => {
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
    it("should successfully authenticate a user with a valid token", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the verifyToken method to return a user ID
        const mockUserId = "12345";
        authService_1.default.verifyToken.mockReturnValue(mockUserId);
        // Create mock request and response objects
        const req = {
            headers: { authorization: "Bearer valid-token" },
            body: {},
        };
        const res = createMockResponse();
        const next = jest.fn();
        // Call the middleware function with all required arguments
        (0, authMiddleware_1.authenticateUser)(req, res, next);
        // Assert that next was called with the user ID
        expect(next).toHaveBeenCalledWith();
        // Assert that the userId was set in the request body
        expect(req.body.userId).toBe(mockUserId);
    }));
    it("should fail to authenticate a user with an invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the verifyToken method to return null for invalid token
        authService_1.default.verifyToken.mockReturnValue(null);
        // Create mock request and response objects
        const req = {
            headers: { authorization: "Bearer invalid-token" },
            body: {},
        };
        const res = createMockResponse();
        const next = jest.fn();
        // Call the middleware function with all required arguments
        yield (0, authMiddleware_1.authenticateUser)(req, res, next);
        // Assert that next was called with an error
        expect(res.status).toHaveBeenCalledWith(401);
        // Assert that the response json method was called with the error message
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - Invalid token' });
    }));
    it("should handle a missing token in the request", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create mock request and response objects
        const req = {
            headers: {},
            body: {},
        };
        const res = createMockResponse();
        const next = jest.fn();
        // Call the middleware function with all required arguments
        yield (0, authMiddleware_1.authenticateUser)(req, res, next);
        // Assert that the response status was set to 401
        expect(res.status).toHaveBeenCalledWith(401);
        // Assert that the response json method was called with the error message
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - No token provided' });
    }));
});
