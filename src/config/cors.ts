import { WHITELIST_DOMAINS } from '../utils/constants';
import { env } from './environment';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError';

export const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        if (!origin && env.BUILD_MODE === 'dev') {
            return callback(null, true);
        }

        if (origin && WHITELIST_DOMAINS.includes(origin)) {
            return callback(null, true);
        }

        return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`));
    },

    optionsSuccessStatus: 200,
    credentials: true,
};
