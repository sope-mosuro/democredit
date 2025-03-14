"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const knexConfig = require("./knexfile");
const environment = "development";
const db = (0, knex_1.default)(knexConfig[environment]);
exports.default = db;
