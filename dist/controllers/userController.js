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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const generalTypes_1 = require("../zod/generalTypes");
const userService_1 = require("../services/userService");
const createNew = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateRequest = yield generalTypes_1.userSchema.safeParseAsync(req.body);
        if (!validateRequest.success) {
            throw new Error('Validate Create New User Request Failed');
        }
        const createdUser = yield userService_1.userService.createNew(validateRequest.data);
        res.status(200).json({
            code: 200,
            message: 'Created New Column Successfully',
            data: createdUser,
        });
    }
    catch (error) {
        next(error);
    }
});
const getUserDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId)
            throw new Error('User ID is required');
        const result = yield userService_1.userService.getUserDetails(userId);
        res.status(200).json({
            code: 200,
            message: 'Created New Column Successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req);
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password)
            throw new Error('Email and Password are required');
        const result = yield userService_1.userService.signIn(email, password);
        res.status(200).json({
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userController = {
    createNew,
    getUserDetails,
    signIn,
};
