class ApiError extends Error {
    statusCode: number;
    name: string;

    constructor(statusCode: number, message: string) {
        super(message);

        this.name = 'ApiError';

        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;
