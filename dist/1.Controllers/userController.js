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
const userService_1 = require("../2.Services/userService");
const generalTypes_1 = require("../zod/generalTypes");
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = req.body;
        if (!form.email || !form.password)
            throw new Error('Email and Password are required');
        const validatedForm = generalTypes_1.userSchema.safeParse(form);
        if (!validatedForm.success)
            throw new Error('Invalid form');
        const result = yield userService_1.userService.signUp(validatedForm.data);
        res.status(200).json({
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userController = {
    signIn,
    signUp,
};
