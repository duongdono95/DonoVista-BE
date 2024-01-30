"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardRoute = void 0;
const express_1 = __importDefault(require("express"));
const boardController_1 = require("../controllers/boardController");
const Router = express_1.default.Router();
Router.route('/').post(boardController_1.boardController.createNew).get(boardController_1.boardController.getAllBoards);
Router.route('/:id').put(boardController_1.boardController.updateBoardById).delete(boardController_1.boardController.deleteBoardById);
exports.boardRoute = Router;
