import { ObjectId } from 'mongodb';
import { GET_DB } from '../config/mongodb';
import { BoardSchemaZodWithId, userInterface, userSchema } from '../zod/generalTypes';
import { BOARD_COLLECTION_NAME } from './boardModel';
import { z } from 'zod';

export const USER_COLLECTION_NAME = 'users';

const INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];
const INVALID_RETURNED_VALUE = ['password'];

const createNew = async (req: userInterface) => {
    console.log(req);
    try {
        if (req._id === 'guestId') {
            delete req['_id' as keyof z.infer<typeof userSchema>];
        }
        const validateExistingUser = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .find({ email: req.email })
            .toArray();
        if (validateExistingUser.length > 0) {
            if (validateExistingUser[0].lastName === 'firebase') {
                return signIn(req.email, req.password);
            } else {
                return {
                    message: 'The Email has already been taken.',
                    path: 'email',
                    code: 300,
                };
            }
        } else {
            const createdUserResult = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(req);
            if (!createdUserResult.insertedId) throw new Error('Create New User failed');
            return {
                code: 200,
                message: 'Create New User successfully',
                data: {
                    ...req,
                    _id: createdUserResult.insertedId,
                },
            };
        }
    } catch (error) {
        throw error;
    }
};

const getUserDetails = async (userId: string) => {
    try {
        const user = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(userId) });
        if (!user) throw new Error('Get User Data failed');
        Object.keys(user as userInterface).forEach((key) => {
            if (INVALID_RETURNED_VALUE.includes(key)) {
                delete user[key as keyof userInterface];
            }
        });
        return user;
    } catch (error) {
        throw error;
    }
};

const signIn = async (email: string, password: string) => {
    try {
        const validateDetail = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .findOne({ email: email, password: password });
        if (!validateDetail)
            return {
                message: 'Email or Password is incorrect',
                path: 'email',
                code: 300,
            };
        Object.keys(validateDetail as userInterface).forEach((key) => {
            if (INVALID_RETURNED_VALUE.includes(key)) {
                delete validateDetail[key as keyof userInterface];
            }
        });
        return {
            code: 200,
            message: 'Sign In Successfully',
            data: validateDetail,
        };
    } catch (error) {
        throw error;
    }
};

export const userModel = {
    createNew,
    getUserDetails,
    signIn,
};
