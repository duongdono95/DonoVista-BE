import express from 'express';
import { cardController } from '../controllers/cardController';

const Router = express.Router();

Router.route('/').post(cardController.createNew).delete(cardController.deleteCard);
Router.route('/:id').put(cardController.updateCard);

export const cardRoute = Router;
