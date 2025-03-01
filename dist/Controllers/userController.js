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
exports.registerUser = void 0;
const userModel_1 = require("../Models/userModel");
const adjutorServices_1 = require("../Services/adjutorServices");
const authService_1 = __importDefault(require("../Services/authService"));
/**
 * @desc create and register a user
 * @route POST /api/users/register
 * @access Public
 */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, bvn } = req.body;
        // Check if user is blacklisted using Adjutor service
        const riskResult = yield (0, adjutorServices_1.checkUserRisk)(email);
        const isBlacklisted = riskResult.isRisky;
        if (isBlacklisted) {
            return res.status(400).json({ message: "User is blacklisted and cannot be registered", reason: riskResult.reason });
        }
        const user = yield (0, userModel_1.createUser)({ name, email, phone, bvn });
        yield (0, userModel_1.updateUserBlacklistStatus)(user.id, isBlacklisted);
        // Generate authentication token after user has been checked
        const token = authService_1.default.generateToken(user.id);
        return res.status(201).json({ message: "User registered", user, token });
    }
    catch (error) {
        return res.status(500).json({ message: "Error registering user" });
    }
});
exports.registerUser = registerUser;
