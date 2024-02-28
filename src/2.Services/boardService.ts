import { Request, Response, NextFunction } from 'express';
import { BoardInterface } from "../zod/generalTypes";
import { boardModel } from "../3.Models/boardModel";
import { ObjectId } from "mongodb";

const createNew = async (validatedReq: Omit<BoardInterface, '_id'>) => {
    try {
        const result = await boardModel.createNew(validatedReq);
       return result
    } catch (error) {
        throw error;
    }
};

const allBoards = async (userId: ObjectId) => {
    try {
        const result = await boardModel.allBoards(userId);
       return result
    } catch (error) {
        throw error;
    }
};

const getBoard = async (boardId: ObjectId) => {
    try {
        const result = await boardModel.getBoard(boardId);
       return result
    } catch (error) {
        throw error;
    }
};

const updateBoard = async (updatedBoard: BoardInterface) => {
    try {
        const result = await boardModel.updateBoard(updatedBoard);
       return result
    } catch (error) {
        throw error;
    }
};

const deleteBoard = async (board: BoardInterface) => {
    try {
        const result = await boardModel.deleteBoard(board);
       return result
    } catch (error) {
        throw error;
    }
};

export const boardService = {
    createNew,
    allBoards,
    getBoard,
    updateBoard,
    deleteBoard
};
