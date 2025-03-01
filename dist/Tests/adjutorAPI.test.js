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
const axios_1 = __importDefault(require("axios"));
const adjutorServices_1 = require("../Services/adjutorServices");
require("jest");
// Mock axios
jest.mock("axios");
describe("AdjutorService", () => {
    describe("checkUserRisk", () => {
        it("should return isRisky: true for blacklisted user", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = {
                data: {
                    data: {
                        karma_identity: "email@example.com",
                        reason: "User is blacklisted",
                    },
                },
            };
            axios_1.default.get.mockResolvedValue(mockResponse);
            const result = yield (0, adjutorServices_1.checkUserRisk)("email@example.com");
            expect(result.isRisky).toBe(true);
            expect(result.reason).toMatch(/User is blacklisted/);
        }));
        it("should handle API errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Network Error");
            axios_1.default.get.mockRejectedValue(error);
            yield expect((0, adjutorServices_1.checkUserRisk)("email@example.com")).rejects.toThrow("Failed to check user risk status");
        }));
        it("should return isRisky: false if no user data is found", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = {
                data: {
                    data: null,
                },
            };
            axios_1.default.get.mockResolvedValue(mockResponse);
            const result = yield (0, adjutorServices_1.checkUserRisk)("email@example.com");
            expect(result.isRisky).toBe(false);
        }));
    });
});
