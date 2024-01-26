import express from 'express';
import { StatusCodes } from 'http-status-codes';

const Router = express.Router();

Router.get('/', (req, res) => {
    res.send('hello Board');
});

export const boardRoute = Router;
