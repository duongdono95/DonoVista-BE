"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const Router = express_1.default.Router();
Router.route('/sign-up').post(userController_1.userController.createNew);
Router.route('/sign-in').post(userController_1.userController.signIn);
Router.route('/:id').post(userController_1.userController.getUserDetails);
exports.userRoute = Router;
