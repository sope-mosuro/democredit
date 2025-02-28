"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const authService_1 = __importDefault(require("../Services/authService"));
const authenticateUser = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
    const userId = authService_1.default.verifyToken(token);
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
    req.body.userId = userId;
    next();
};
exports.authenticateUser = authenticateUser;
