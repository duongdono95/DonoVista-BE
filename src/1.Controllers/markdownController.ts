import { Request, Response, NextFunction } from 'express';
import { userService } from '../2.Services/userService';
import { markdownSchema, userSchema } from '../zod/generalTypes';
import { markdownService } from '../2.Services/markdownService';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validateMarkdown = markdownSchema.omit({ _id: true }).safeParse(req.body);
        if (!validateMarkdown.success) throw new Error('Markdown Validation failed');

        const result = await markdownService.createNew(validateMarkdown.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Markdown successfully',
        });
    } catch (error) {
        next(error);
    }
};

const getMarkdown = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id) throw new Error('Missing required Field');
        const result = await markdownService.getMarkdown(id);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Markdown successfully',
        });
    } catch (error) {
        next(error);
    }
};
export const markdownController = {
    createNew,
    getMarkdown,
};
