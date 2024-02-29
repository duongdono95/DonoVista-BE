import express from 'express';
import { columnController } from '../1.Controllers/columnController';

const Router = express.Router();

Router.route('/').post(columnController.createNew);
Router.route('/:id').put(columnController.editColumn).delete(columnController.deleteColumn);

export const columnRoute = Router;
