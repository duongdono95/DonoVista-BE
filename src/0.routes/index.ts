import express from 'express';

import { userRoute } from './userRoute';
import { boardRoute } from './boardRoute';
import { cardRoute } from './cardRoute';
import { columnRoute } from './ColumnRoute';

const Router = express.Router();

Router.use('/boards', boardRoute);
Router.use('/columns', columnRoute);
Router.use('/cards', cardRoute);
Router.use('/users', userRoute);

export const app_router = Router;
