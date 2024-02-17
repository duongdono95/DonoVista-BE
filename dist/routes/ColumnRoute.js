"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.columnRoute = void 0;
const express_1 = __importDefault(require("express"));
const columnController_1 = require("../controllers/columnController");
const Router = express_1.default.Router();
Router.route('/')
    .post(columnController_1.columnController.createNew)
    .delete(columnController_1.columnController.deleteColumnById)
    .put(columnController_1.columnController.arrangeCards);
Router.route('/:id').put(columnController_1.columnController.updateColumnById);
Router.route('/duplicateColumn').post(columnController_1.columnController.duplicateColumn);
Router.route('/duplicateCard').post(columnController_1.columnController.duplicateCard);
exports.columnRoute = Router;
