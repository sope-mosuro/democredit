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
exports.checkUserRisk = void 0;
const axios_1 = __importDefault(require("axios"));
const ADJUTOR_API_URL = 'https://adjutor.lendsqr.com/v2/verification/karma';
const checkUserRisk = (identity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${ADJUTOR_API_URL}/${identity}`, { headers: { Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}` } });
        const userData = response.data.data;
        if (userData) {
            return { isRisky: true, reason: userData.reason || "User is blacklisted" };
        }
        return { isRisky: false };
    }
    catch (error) {
        console.error('Error checking risk status:', error);
        throw new Error('Failed to check user risk status');
    }
});
exports.checkUserRisk = checkUserRisk;
