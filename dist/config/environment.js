"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
exports.env = {
    MONGODB_URI: process.env.MONGODB_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    APP_HOST: process.env.APP_HOST,
    APP_PORT: parseInt((_a = process.env.APP_PORT) !== null && _a !== void 0 ? _a : '1995'),
    BUILD_MODE: process.env.BUILD_MODE,
    AUTHOR: process.env.AUTHOR,
};
