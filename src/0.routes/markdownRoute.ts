import express from 'express';
import { markdownController } from '../1.Controllers/markdownController';

const Router = express.Router();

Router.route('/').post(markdownController.createNew);
Router.route('/:id').get(markdownController.getMarkdown);

export const markdownRoute = Router;
