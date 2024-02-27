import express from 'express';
import { userController } from "../1.Controllers/userController";

const Router = express.Router();

Router.route('/sign-in').post(userController.signIn);
Router.route('/sign-up').post(userController.signUp);

export const userRoute = Router;
