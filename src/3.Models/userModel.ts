import { ObjectId } from 'mongodb';
import { GET_DB } from '../config/mongodb';
import { z } from 'zod';
import { UserInterface, userSchema } from '../zod/generalTypes';

export const USER_COLLECTION_NAME = 'users';

export const INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];
export const INVALID_RETURNED_VALUE = ['password'];

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
        Object.keys(validateDetail as unknown as UserInterface).forEach((key) => {
            if (INVALID_RETURNED_VALUE.includes(key)) {
                delete validateDetail[key as keyof UserInterface];
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

const signUp = async (req: UserInterface) => {
    try {
        const validatedReq = userSchema.omit({ _id: true }).safeParse(req);
        if (!validatedReq.success) throw new Error('User Model - Invalid form');
        const validateExistingUser = await GET_DB()
            .collection(USER_COLLECTION_NAME)
            .find({ email: validatedReq.data.email })
            .toArray();
        if (validateExistingUser.length > 0) {
            if (validateExistingUser[0].lastName === 'firebase') {
                return signIn(validatedReq.data.email, validatedReq.data.password);
            } else {
                return {
                    message: 'The Email has already been taken.',
                    path: 'email',
                    code: 300,
                };
            }
        } else {
            const createdUserResult = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validatedReq.data);
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

export const userModel = {
    signIn,
    signUp,
};
