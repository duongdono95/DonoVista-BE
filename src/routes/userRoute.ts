import express from 'express';
import { userController } from '../controllers/userController';

const Router = express.Router();

Router.route('/sign-up').post(userController.createNew);
Router.route('/sign-in').post(userController.signIn);
Router.route('/:id').post(userController.getUserDetails);

export const userRoute = Router;
