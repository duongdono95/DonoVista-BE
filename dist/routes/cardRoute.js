"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRoute = void 0;
const express_1 = __importDefault(require("express"));
const cardController_1 = require("../controllers/cardController");
const Router = express_1.default.Router();
Router.route('/').post(cardController_1.cardController.createNew);
// .get(cardController.getAllBoards);
// Router.route('/:id').get(cardController.getBoardById).put(cardController.updateBoardById).delete(cardController.deleteBoardById);
exports.cardRoute = Router;
