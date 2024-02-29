"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRoute = void 0;
const express_1 = __importDefault(require("express"));
const cardController_1 = require("../1.Controllers/cardController");
const Router = express_1.default.Router();
Router.route('/').post(cardController_1.cardController.createNew);
Router.route('/:id').delete(cardController_1.cardController.deleteCard).put(cardController_1.cardController.editCard);
Router.route('/moving').post(cardController_1.cardController.moveCard);
exports.cardRoute = Router;
