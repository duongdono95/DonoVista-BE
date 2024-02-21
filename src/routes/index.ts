import express from 'express';
import { boardRoute } from './boardRoute';
import { columnRoute } from './ColumnRoute';
import { cardRoute } from './cardRoute';
import { userRoute } from './userRoute';

const Router = express.Router();

Router.use('/boards', boardRoute);
Router.use('/columns', columnRoute);
Router.use('/cards', cardRoute);
Router.use('/users', userRoute);

export const app_router = Router;
