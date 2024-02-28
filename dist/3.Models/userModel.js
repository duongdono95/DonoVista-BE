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
exports.userModel = exports.INVALID_RETURNED_VALUE = exports.INVALID_UPDATED_FIELDS = exports.USER_COLLECTION_NAME = void 0;
const mongodb_1 = require("../config/mongodb");
const generalTypes_1 = require("../zod/generalTypes");
exports.USER_COLLECTION_NAME = 'users';
exports.INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];
exports.INVALID_RETURNED_VALUE = ['password'];
// const getUserDetails = async (userId: string) => {
//     try {
//         const user = await GET_DB()
//             .collection(USER_COLLECTION_NAME)
//             .findOne({ _id: new ObjectId(userId) });
//         if (!user) throw new Error('Get User Data failed');
//         Object.keys(user as userInterface).forEach((key) => {
//             if (INVALID_RETURNED_VALUE.includes(key)) {
//                 delete user[key as keyof userInterface];
//             }
//         });
//         return user;
//     } catch (error) {
//         throw error;
//     }
// };
const signIn = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(email, password);
    try {
        const validateDetail = yield (0, mongodb_1.GET_DB)()
            .collection(exports.USER_COLLECTION_NAME)
            .findOne({ email: email, password: password });
        if (!validateDetail)
            return {
                message: 'Email or Password is incorrect',
                path: 'email',
                code: 300,
            };
        Object.keys(validateDetail).forEach((key) => {
            if (exports.INVALID_RETURNED_VALUE.includes(key)) {
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
const signUp = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedReq = generalTypes_1.userSchema.omit({ _id: true }).safeParse(req);
        if (!validatedReq.success)
            throw new Error('User Model - Invalid form');
        const validateExistingUser = yield (0, mongodb_1.GET_DB)()
            .collection(exports.USER_COLLECTION_NAME)
            .find({ email: validatedReq.data.email })
            .toArray();
        if (validateExistingUser.length > 0) {
            if (validateExistingUser[0].lastName === 'firebase') {
                return signIn(validatedReq.data.email, validatedReq.data.password);
            }
            else {
                return {
                    message: 'The Email has already been taken.',
                    path: 'email',
                    code: 300,
                };
            }
        }
        else {
            const createdUserResult = yield (0, mongodb_1.GET_DB)().collection(exports.USER_COLLECTION_NAME).insertOne(validatedReq.data);
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
exports.userModel = {
    signIn,
    signUp
};
