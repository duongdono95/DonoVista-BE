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
    .put(columnController_1.columnController.updateColumnCards);
Router.route('/:id').put(columnController_1.columnController.updateColumnById);
Router.route('/duplicate').post(columnController_1.columnController.duplicateColumn);
exports.columnRoute = Router;
