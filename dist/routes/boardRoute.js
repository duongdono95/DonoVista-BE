"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardRoute = void 0;
const express_1 = __importDefault(require("express"));
const boardController_1 = require("../1.Controllers/boardController");
const Router = express_1.default.Router();
Router.route('/').post(boardController_1.boardController.createNew).get(boardController_1.boardController.allBoards);
Router.route('/:id').get(boardController_1.boardController.getBoard).put(boardController_1.boardController.updateBoard).delete(boardController_1.boardController.deleteBoard);
exports.boardRoute = Router;
