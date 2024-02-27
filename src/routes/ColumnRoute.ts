import express from 'express';
import { columnController } from "../1.Controllers/columnController";

const Router = express.Router();

Router.route('/').post(columnController.createNew);

export const columnRoute = Router;
