import { NextFunction, Request, Response } from 'express';
import { createNewBoardRequestType } from '../zod/generalTypes';
import { StatusCodes } from 'http-status-codes';
import { boardService } from '../services/boardService';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedBoard = await createNewBoardRequestType.safeParseAsync(req.body);
        console.log(req.body);
        if (!validatedBoard.success) {
            return res.status(200).json({
                code: StatusCodes.BAD_REQUEST,
                message: 'Request Creating New Board Validation Failed',
                errors: validatedBoard.error.toString(),
            });
        }
        const createdBoard = await boardService.createNew(validatedBoard.data);
        console.log(createdBoard);
        res.status(200).json({
            code: 200,
            message: 'Created New Board Successfully',
            data: createdBoard,
        });
    } catch (error) {
        next(error);
    }
};

const getAllBoards = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boards = await boardService.getAllBoards();
        if (!boards) res.status(200).json({ message: 'No Board was found' });
        return res.status(200).json({
            code: 200,
            message: 'Get All Boards Successfully',
            data: boards,
        });
    } catch (error) {
        next(error);
    }
};
export const boardController = {
    createNew,
    getAllBoards,
};
