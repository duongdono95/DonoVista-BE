"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownRoute = void 0;
const express_1 = __importDefault(require("express"));
const markdownController_1 = require("../1.Controllers/markdownController");
const Router = express_1.default.Router();
Router.route('/').post(markdownController_1.markdownController.createNew);
Router.route('/:id').get(markdownController_1.markdownController.getMarkdown);
exports.markdownRoute = Router;
