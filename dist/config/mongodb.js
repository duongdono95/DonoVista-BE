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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOSE_DB = exports.GET_DB = exports.CONNECT_DB = void 0;
// donovista
// XH4qn2r6iqHkhKGv
const mongodb_1 = require("mongodb");
const environment_1 = require("./environment");
let donoVistaInstance = null;
const mongoClientInstance = new mongodb_1.MongoClient((_a = environment_1.env.MONGODB_URI) !== null && _a !== void 0 ? _a : '', {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
const CONNECT_DB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoClientInstance.connect();
    donoVistaInstance = mongoClientInstance.db(environment_1.env.DATABASE_NAME);
});
exports.CONNECT_DB = CONNECT_DB;
const GET_DB = () => {
    if (!donoVistaInstance)
        throw new Error('Must connect to Database first.');
    return donoVistaInstance;
};
exports.GET_DB = GET_DB;
const CLOSE_DB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoClientInstance.close();
});
exports.CLOSE_DB = CLOSE_DB;
