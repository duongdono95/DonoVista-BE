import express from 'express';

import { userRoute } from './userRoute';
import { boardRoute } from "./boardRoute";
import { columnRoute } from "./columnRoute";
import { cardRoute } from "./cardRoute";

const Router = express.Router();

Router.use('/boards', boardRoute);
Router.use('/columns', columnRoute);
Router.use('/cards', cardRoute);
Router.use('/users', userRoute);

export const app_router = Router;
