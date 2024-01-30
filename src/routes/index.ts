import express from 'express';
import { boardRoute } from './boardRoute';
import { columnRoute } from "./ColumnRoute";

const Router = express.Router();

Router.use('/boards', boardRoute);
Router.use('/columns', columnRoute);

export const app_router = Router;
