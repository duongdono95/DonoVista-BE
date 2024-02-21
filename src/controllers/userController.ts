import { Request, Response, NextFunction } from 'express';
import { userSchema } from '../zod/generalTypes';
import { userService } from '../services/userService';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validateRequest = await userSchema.safeParseAsync(req.body);
        if (!validateRequest.success) {
            throw new Error('Validate Create New User Request Failed');
        }
        const createdUser = await userService.createNew(validateRequest.data);
        res.status(200).json({
            code: 200,
            message: 'Created New Column Successfully',
            data: createdUser,
        });
    } catch (error) {
        next(error);
    }
};

const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        if (!userId) throw new Error('User ID is required');
        const result = await userService.getUserDetails(userId);
        res.status(200).json({
            code: 200,
            message: 'Created New Column Successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) throw new Error('Email and Password are required');

        const result = await userService.signIn(email, password);
        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const userController = {
    createNew,
    getUserDetails,
    signIn,
};
