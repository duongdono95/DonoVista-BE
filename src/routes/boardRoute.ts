import express from 'express';
import { boardController } from "../1.Controllers/boardController";

const Router = express.Router();

Router.route('/').post(boardController.createNew).get(boardController.allBoards);
Router.route('/:id').get(boardController.getBoard).put(boardController.updateBoard).delete(boardController.deleteBoard)
export const boardRoute = Router;
