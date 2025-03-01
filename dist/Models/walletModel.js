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
exports.updateWalletBalance = exports.getWalletByUserId = exports.createWallet = void 0;
const Database_1 = __importDefault(require("../config/Database"));
const createWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const [walletId] = yield (0, Database_1.default)("wallets").insert({ user_id: userId, balance: 0 });
    const wallet = yield (0, Database_1.default)("wallets").where({ id: walletId }).first();
    return wallet;
});
exports.createWallet = createWallet;
const getWalletByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield (0, Database_1.default)("wallets").where({ user_id: userId }).first();
    return wallet || null;
});
exports.getWalletByUserId = getWalletByUserId;
const updateWalletBalance = (walletId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, Database_1.default)("wallets").where({ id: walletId }).increment("balance", amount);
});
exports.updateWalletBalance = updateWalletBalance;
