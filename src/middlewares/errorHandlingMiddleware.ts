import { StatusCodes } from 'http-status-codes';
import { env } from '../config/environment';
import { NextFunction, Request, Response } from 'express';

export const errorHandlingMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    // res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(validatedBoard.error.issues);
    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode],
        stack: err.stack,
    };

    if (env.BUILD_MODE !== 'dev') delete responseError.stack;

    res.status(responseError.statusCode).json(responseError);
};
export const handleNewError = (error: unknown) => {
    if (error instanceof Error) {
        throw new Error(error.message);
    } else {
        // If it's not an Error instance, convert it to string
        throw new Error(String(error));
    }
};
