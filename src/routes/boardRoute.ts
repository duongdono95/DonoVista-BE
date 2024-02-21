import express from 'express';
import { boardController } from '../controllers/boardController';

const Router = express.Router();

Router.route('/').post(boardController.createNew);

Router.route('/:id')
    .get(boardController.getBoardById)
    .put(boardController.updateBoardById)
    .delete(boardController.deleteBoardById);

Router.route('/user/:id').get(boardController.getAllBoards);

export const boardRoute = Router;
