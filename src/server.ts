import express, { Express } from 'express';
import { CLOSE_DB, CONNECT_DB } from './config/mongodb';
import cors from 'cors';
import { corsOptions } from './config/cors';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware';
import AsyncExitHook from 'async-exit-hook';
import { env } from './config/environment';
import { app_router } from './0.routes';

const port = process.env.APP_PORT || 3000;

const START_SERVER = () => {
    const app: Express = express();
    const port = env.APP_PORT;
    const host = env.APP_HOST;
    if (!port || !host) throw new Error('post or host not found');

    app.use(cors(corsOptions));
    app.use(express.json());

    app.use('/', app_router);

    app.use(errorHandlingMiddleware);
    app.listen(port, host, () => {
        console.log(`Hello ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`);
    });
    AsyncExitHook(() => CLOSE_DB);
};

(async () => {
    try {
        console.log('Connecting to MongoDB Cloud Atlats...');
        await CONNECT_DB();
        console.log('Connected to MongoDB Cloud Atlats!!!');
        START_SERVER();
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
})();
