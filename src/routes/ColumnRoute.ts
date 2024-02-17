import express from 'express';
import { columnController } from '../controllers/columnController';

const Router = express.Router();

Router.route('/')
    .post(columnController.createNew)
    .delete(columnController.deleteColumnById)
    .put(columnController.arrangeCards);
Router.route('/:id').put(columnController.updateColumnById);
Router.route('/duplicateColumn').post(columnController.duplicateColumn);
Router.route('/duplicateCard').post(columnController.duplicateCard);
export const columnRoute = Router;
