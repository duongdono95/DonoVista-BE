import express from 'express';
import { boardController } from '../1.Controllers/boardController';

const Router = express.Router();

Router.route('/').post(boardController.createNew).get(boardController.allBoards);
Router.route('/:id').get(boardController.getBoard).put(boardController.updateBoard).delete(boardController.deleteBoard);
Router.route('/duplicate').post(boardController.duplicate);
export const boardRoute = Router;
