import express from 'express';
import { columnController } from '../controllers/columnController';

const Router = express.Router();

Router.route('/')
    .post(columnController.createNew)
    .delete(columnController.deleteColumnById)
    .put(columnController.updateColumnCards);
Router.route('/:id').put(columnController.updateColumnById);

export const columnRoute = Router;
