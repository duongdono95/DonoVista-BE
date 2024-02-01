import express from 'express';
import { columnController } from "../controllers/columnController";


const Router = express.Router();

Router.route('/').post(columnController.createNew).delete(columnController.deleteColumnById)
// .get(boardController.getAllBoards);
// Router.route('/:id').put(boardController.updateBoardById).delete(boardController.deleteBoardById);

export const columnRoute = Router;
