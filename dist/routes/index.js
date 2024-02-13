"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_router = void 0;
const express_1 = __importDefault(require("express"));
const boardRoute_1 = require("./boardRoute");
const ColumnRoute_1 = require("./ColumnRoute");
const cardRoute_1 = require("./cardRoute");
const Router = express_1.default.Router();
Router.use('/boards', boardRoute_1.boardRoute);
Router.use('/columns', ColumnRoute_1.columnRoute);
Router.use('/cards', cardRoute_1.cardRoute);
exports.app_router = Router;
