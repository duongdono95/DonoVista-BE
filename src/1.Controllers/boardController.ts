import { Request, Response, NextFunction } from 'express';
import { BoardSchema } from "../zod/generalTypes";
import { boardService } from "../2.Services/boardService";
import { ObjectId } from "mongodb";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedReq =  BoardSchema.omit({_id: true}).safeParse(req.body)
        if(!validatedReq.success) throw new Error(validatedReq.error.errors[0].message)
        const result = await boardService.createNew(validatedReq.data);
        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
const allBoards = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.userId;
        const result = await boardService.allBoards(new ObjectId(userId));
        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
const getBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.id
        const result = await boardService.getBoard(new ObjectId(boardId));
        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const updateBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedBoard = BoardSchema.safeParse(req.body)
        if(!validatedBoard.success) throw new Error(validatedBoard.error.errors[0].message)
        const result = await boardService.updateBoard(validatedBoard.data);
        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const board = req.params.body;
        const validatedBoard = BoardSchema.safeParse(board);
        if(!validatedBoard.success) throw new Error(validatedBoard.error.errors[0].message)
        const result = await boardService.deleteBoard(validatedBoard.data);
        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};



export const boardController = {
    createNew,
    allBoards,
    getBoard,
    updateBoard,
    deleteBoard
};
