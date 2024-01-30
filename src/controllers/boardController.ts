import { NextFunction, Request, Response } from 'express';
import { NewBoardRequestZod } from '../zod/generalTypes';
import { StatusCodes } from 'http-status-codes';
import { boardService } from '../services/boardService';
import { slugify } from "../utils/formatter";

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

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedBoard = await NewBoardRequestZod.safeParseAsync(req.body);
        if (!validatedBoard.success) {
            return res.status(200).json({
                code: StatusCodes.BAD_REQUEST,
                message: 'Request Creating New Board Validation Failed',
                errors: validatedBoard.error.toString(),
            });
        }
        const createdBoard = await boardService.createNew(validatedBoard.data);
        res.status(200).json({
            code: 200,
            message: 'Created New Board Successfully',
            data: createdBoard,
        });
    } catch (error) {
        next(error);
    }
};

const updateBoardById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.id;
        const requestedBoard = { ...req.body, slug: slugify(req.body.title) };
        const validatedBoard = await NewBoardRequestZod.safeParseAsync(requestedBoard);
        if (!validatedBoard.success) {
            return res.status(200).json({
                code: StatusCodes.BAD_REQUEST,
                message: 'Request Creating New Board Validation Failed',
                errors: validatedBoard.error.toString(),
            });
        }
        const updatedBoard = await boardService.updateBoardById(boardId,validatedBoard.data);
        if(!updatedBoard) throw new Error('Update Board Failed')
        res.status(200).json({
            code: 200,
            message: 'Updated Board Successfully',
            data: updatedBoard,
        });
    } catch (error) {

        next(error)
    }
}



export const boardController = {
    getAllBoards,
    createNew,
    updateBoardById
};
