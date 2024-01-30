"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlingMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const environment_1 = require("../config/environment");
const errorHandlingMiddleware = (err, req, res, next) => {
    if (!err.statusCode)
        err.statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    // res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(validatedBoard.error.issues);
    const responseError = {
        statusCode: err.statusCode,
        message: err.message || http_status_codes_1.StatusCodes[err.statusCode],
        stack: err.stack,
    };
    if (environment_1.env.BUILD_MODE !== 'dev')
        delete responseError.stack;
    res.status(200).json(responseError);
};
exports.errorHandlingMiddleware = errorHandlingMiddleware;
