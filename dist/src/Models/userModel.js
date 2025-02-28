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
exports.updateUserBlacklistStatus = exports.createUser = void 0;
const Database_1 = __importDefault(require("../config/Database"));
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const [newUser] = yield (0, Database_1.default)("users").insert(user).returning("*");
    return newUser;
});
exports.createUser = createUser;
const updateUserBlacklistStatus = (id, isBlacklisted) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, Database_1.default)("users").where({ id }).update({ is_blacklisted: isBlacklisted });
});
exports.updateUserBlacklistStatus = updateUserBlacklistStatus;
