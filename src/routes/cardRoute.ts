import express from 'express';
import { cardController } from "../controllers/cardController";


const Router = express.Router();

Router.route('/').post(cardController.createNew)
// .get(cardController.getAllBoards);
// Router.route('/:id').get(cardController.getBoardById).put(cardController.updateBoardById).delete(cardController.deleteBoardById);

export const cardRoute = Router;
