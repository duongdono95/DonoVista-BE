import express from 'express';
import { cardController } from '../1.Controllers/cardController';

const Router = express.Router();

Router.route('/').post(cardController.createNew);
Router.route('/:id').delete(cardController.deleteCard).put(cardController.editCard);
Router.route('/moving').post(cardController.moveCard);
export const cardRoute = Router;
