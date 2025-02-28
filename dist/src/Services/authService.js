"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET;
class AuthService {
    // Generate a faux token
    static generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId: userId.toString() }, SECRET_KEY, { expiresIn: '3h' });
    }
    // Validate the faux token
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            return decoded.userId;
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = AuthService;
