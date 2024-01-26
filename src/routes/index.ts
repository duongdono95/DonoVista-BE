import express from 'express';
import { boardRoute } from './boardRouter';

const Router = express.Router();

Router.use('/board', boardRoute);

export const app_router = Router;
