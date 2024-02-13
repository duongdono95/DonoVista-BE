import express from 'express';
import { boardRoute } from './boardRoute';
import { columnRoute } from "./ColumnRoute";
import { cardRoute } from "./cardRoute";

const Router = express.Router();

Router.use('/boards', boardRoute);
Router.use('/columns', columnRoute);
Router.use('/cards', cardRoute);
export const app_router = Router;
