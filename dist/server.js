"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("./config/mongodb");
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("./config/cors");
const errorHandlingMiddleware_1 = require("./middlewares/errorHandlingMiddleware");
const async_exit_hook_1 = __importDefault(require("async-exit-hook"));
const environment_1 = require("./config/environment");
const routes_1 = require("./routes");
const port = process.env.APP_PORT || 3000;
const START_SERVER = () => {
    const app = (0, express_1.default)();
    const port = environment_1.env.APP_PORT;
    const host = environment_1.env.APP_HOST;
    if (!port || !host)
        throw new Error('post or host not found');
    app.use((0, cors_1.default)(cors_2.corsOptions));
    app.use(express_1.default.json());
    app.use('/', routes_1.app_router);
    app.use(errorHandlingMiddleware_1.errorHandlingMiddleware);
    app.listen(port, host, () => {
        console.log(`Hello ${environment_1.env.AUTHOR}, I am running at http://${environment_1.env.APP_HOST}:${environment_1.env.APP_PORT}/`);
    });
    (0, async_exit_hook_1.default)(() => mongodb_1.CLOSE_DB);
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Connecting to MongoDB Cloud Atlats...');
        yield (0, mongodb_1.CONNECT_DB)();
        console.log('Connected to MongoDB Cloud Atlats!!!');
        START_SERVER();
    }
    catch (error) {
        console.log(error);
        process.exit(0);
    }
}))();
