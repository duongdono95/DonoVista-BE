import { Request, Response, NextFunction } from 'express';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {


        // const result = await userService.createNew(email, password);
        // res.status(200).json({
        //     data: result,
        // });
    } catch (error) {
        next(error);
    }
};

export const cardService = {
    createNew,
};
