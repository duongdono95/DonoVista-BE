import express from 'express';
import { boardController } from '../controllers/boardController';

const Router = express.Router();

Router.route('/').post(boardController.createNew).get(boardController.getAllBoards);
export const boardRoute = Router;
