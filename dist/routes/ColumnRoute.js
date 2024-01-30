"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.columnRoute = void 0;
const express_1 = __importDefault(require("express"));
const columnController_1 = require("../controllers/columnController");
const Router = express_1.default.Router();
Router.route('/').post(columnController_1.columnController.createNew);
// .get(boardController.getAllBoards);
// Router.route('/:id').put(boardController.updateBoardById).delete(boardController.deleteBoardById);
exports.columnRoute = Router;
