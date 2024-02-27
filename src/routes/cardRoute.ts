import express from 'express';
import { cardController } from "../1.Controllers/cardController";

const Router = express.Router();

Router.route('/').post(cardController.createNew);

export const cardRoute = Router;
