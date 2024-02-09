import { NextFunction, Request, Response } from 'express';
import { BoardSchemaZod } from '../zod/generalTypes';
import { StatusCodes } from 'http-status-codes';
import { boardService } from '../services/boardService';
import { slugify } from '../utils/formatter';

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
        const validatedBoard = await BoardSchemaZod.safeParseAsync(req.body);
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
        if (!boardId) throw new Error('Board Id is required');
        const validatedBoard = await BoardSchemaZod.safeParseAsync(req.body);
        if (!validatedBoard.success) {
            return res.status(200).json({
                code: StatusCodes.BAD_REQUEST,
                message: 'Request Creating New Board Validation Failed',
                errors: validatedBoard.error.toString(),
            });
        }
        const updatedBoard = await boardService.updateBoardById(boardId, validatedBoard.data);
        if (!updatedBoard) throw new Error('Update Board Failed');

        res.status(200).json({
            code: 200,
            message: 'Updated Board Successfully',
            data: updatedBoard,
        });
    } catch (error) {
        next(error);
    }
};

const deleteBoardById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.id;
        if (!boardId) throw new Error('Board Id is required');
        const response = await boardService.deleteBoardById(boardId);
        if (!response) throw new Error('Board Delete Failed');
        res.status(200).json({
            code: 200,
            message: 'Delete Board Successfully',
        });
    } catch (error) {
        next(error);
    }
};
const getBoardById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.id;
        if (!boardId) throw new Error('Board Id is required');
        const result = await boardService.getBoardById(boardId);
        if (!result) throw new Error('Fetch Board Detail failed');
        res.status(200).json({
            code: 200,
            message: 'Fetch Board Detail Successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const boardController = {
    getAllBoards,
    createNew,
    updateBoardById,
    deleteBoardById,
    getBoardById,
};
