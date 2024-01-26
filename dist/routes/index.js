"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_router = void 0;
const express_1 = __importDefault(require("express"));
const boardRouter_1 = require("./boardRouter");
const Router = express_1.default.Router();
Router.use('/board', boardRouter_1.boardRoute);
exports.app_router = Router;
