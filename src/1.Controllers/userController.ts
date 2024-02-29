import { Request, Response, NextFunction } from 'express';
import { userService } from '../2.Services/userService';
import { userSchema } from '../zod/generalTypes';

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

const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const form = req.body;
        if (!form.email || !form.password) throw new Error('Email and Password are required');
        const validatedForm = userSchema.safeParse(form);
        if (!validatedForm.success) throw new Error('Invalid form');
        const result = await userService.signUp(validatedForm.data);
        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const userController = {
    signIn,
    signUp,
};
