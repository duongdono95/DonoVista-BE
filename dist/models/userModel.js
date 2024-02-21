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
exports.userModel = exports.USER_COLLECTION_NAME = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../config/mongodb");
exports.USER_COLLECTION_NAME = 'users';
const INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];
const INVALID_RETURNED_VALUE = ['password'];
const createNew = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateExistingUser = yield (0, mongodb_2.GET_DB)()
            .collection(exports.USER_COLLECTION_NAME)
            .find({ email: req.email })
            .toArray();
        if (validateExistingUser.length > 0) {
            return {
                message: 'The Email has already been taken.',
                path: 'email',
                code: 300,
            };
        }
        else {
            const createdUserResult = yield (0, mongodb_2.GET_DB)().collection(exports.USER_COLLECTION_NAME).insertOne(req);
            if (!createdUserResult.insertedId)
                throw new Error('Create New User failed');
            return {
                code: 200,
                message: 'Create New User successfully',
                data: Object.assign(Object.assign({}, req), { _id: createdUserResult.insertedId }),
            };
        }
    }
    catch (error) {
        throw error;
    }
});
const getUserDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, mongodb_2.GET_DB)()
            .collection(exports.USER_COLLECTION_NAME)
            .findOne({ _id: new mongodb_1.ObjectId(userId) });
        if (!user)
            throw new Error('Get User Data failed');
        Object.keys(user).forEach((key) => {
            if (INVALID_RETURNED_VALUE.includes(key)) {
                delete user[key];
            }
        });
        return user;
    }
    catch (error) {
        throw error;
    }
});
const signIn = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateDetail = yield (0, mongodb_2.GET_DB)()
            .collection(exports.USER_COLLECTION_NAME)
            .findOne({ email: email, password: password });
        if (!validateDetail)
            return {
                message: 'Email or Password is incorrect',
                path: 'email',
                code: 300,
            };
        Object.keys(validateDetail).forEach((key) => {
            if (INVALID_RETURNED_VALUE.includes(key)) {
                delete validateDetail[key];
            }
        });
        return {
            code: 200,
            message: 'Sign In Successfully',
            data: validateDetail,
        };
    }
    catch (error) {
        throw error;
    }
});
exports.userModel = {
    createNew,
    getUserDetails,
    signIn,
};
