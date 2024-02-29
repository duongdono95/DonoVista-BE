import { Request, Response, NextFunction } from 'express';
import { BoardInterface, CardInterface, ColumnInterface } from '../zod/generalTypes';
import { boardModel } from '../3.Models/boardModel';
import { ObjectId } from 'mongodb';

const createNew = async (validatedReq: Omit<BoardInterface, '_id'>) => {
    try {
        const result = await boardModel.createNew(validatedReq);
        return result;
    } catch (error) {
        throw error;
    }
};

const allBoards = async (userId: string) => {
    try {
        const result = await boardModel.allBoards(userId);
        return result;
    } catch (error) {
        throw error;
    }
};

const getBoard = async (boardId: ObjectId) => {
    try {
        const result = await boardModel.getBoard(boardId);
        return result;
    } catch (error) {
        throw error;
    }
};

const updateBoard = async (updatedBoard: BoardInterface) => {
    try {
        const result = await boardModel.updateBoard(updatedBoard);
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteBoard = async (boardId: string) => {
    try {
        const result = await boardModel.deleteBoard(boardId);
        return result;
    } catch (error) {
        throw error;
    }
};

const duplicate = async (
    originalColumn: null | ColumnInterface,
    newColumn: ColumnInterface,
    activeCard: CardInterface | null,
) => {
    try {
        const result = await boardModel.duplicate(originalColumn, newColumn, activeCard);
        return result;
    } catch (error) {
        throw error;
    }
};

export const boardService = {
    createNew,
    allBoards,
    getBoard,
    updateBoard,
    deleteBoard,
    duplicate,
};
