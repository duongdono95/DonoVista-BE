import { z } from 'zod';
import { NewBoardRequestType, NewBoardRequestZod } from '../zod/generalTypes';
import { slugify } from '../utils/formatter';
import { boardModel } from '../models/boardModel';
import { ObjectId } from 'mongodb';

const getAllBoards = async () => {
    try {
        const boards = await boardModel.getAllBoards();
        return boards;
    } catch (error) {
        throw error;
    }
};

const createNew = async (validatedRequest: NewBoardRequestType) => {
    try {
        const newBoard = { ...validatedRequest, slug: slugify(validatedRequest.title) };
        const createdBoard = await boardModel.createNew(newBoard);
        if (!createdBoard) throw new Error('Save New Board Failed');
        return await boardModel.findOneById(createdBoard.insertedId);
    } catch (error) {
        throw error;
    }
};

 const updateBoardById = async (boardId: string, validatedRequest: NewBoardRequestType) => {
    try {
        const result = await boardModel.updateOneById(new ObjectId(boardId), validatedRequest);
        console.log(result);
        return result;
    } catch (error) {
        throw error;
    }
};
 const deleteBoardById = async (boardId: string) => {
    try {
        const result = await boardModel.deleteOneById(boardId);
        if (result.deletedCount === 0) throw new Error('Delete Required Board Failed');
        return result;
    } catch (error) {
        throw error;
    }
};

 const getBoardById = async (boardId: string) => {
    try {
        const result = await boardModel.getBoardById(boardId);
        return result;
    } catch (error) {
        throw error;
    }
};

export const boardService = {
    getAllBoards,
    createNew,
    updateBoardById,
    deleteBoardById,
    getBoardById
};
