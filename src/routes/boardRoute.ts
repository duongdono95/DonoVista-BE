import express from 'express';
import { boardController } from '../controllers/boardController';

const Router = express.Router();

Router.route('/').post(boardController.createNew).get(boardController.getAllBoards);
Router.route('/:id').put(boardController.updateBoardById).delete(boardController.deleteBoardById);

export const boardRoute = Router;
