import { z } from 'zod';
import { BoardSchemaZodWithId } from '../zod/generalTypes';
import { slugify } from '../utils/formatter';
import { boardModel } from '../models/boardModel';
import { ObjectId } from 'mongodb';

const getAllBoards = async (userId: string) => {
    try {
        const boards = await boardModel.getAllBoards(userId);
        return boards;
    } catch (error) {
        throw error;
    }
};

const getBoardById = async (boardId: string) => {
    try {
        const result = await boardModel.getBoardById(new ObjectId(boardId));
        return result;
    } catch (error) {
        throw error;
    }
};

const createNew = async (validatedRequest: Omit<z.infer<typeof BoardSchemaZodWithId>, '_id'>) => {
    try {
        const newBoard = { ...validatedRequest, slug: slugify(validatedRequest.title) };
        const createdBoard = await boardModel.createNew(newBoard);
        if (!createdBoard) throw new Error('Save New Board Failed');
        return await boardModel.getBoardById(createdBoard.insertedId);
    } catch (error) {
        throw error;
    }
};

const updateBoardById = async (boardId: string, validatedRequest: z.infer<typeof BoardSchemaZodWithId>) => {
    try {
        const result = await boardModel.updateOneById(new ObjectId(boardId), validatedRequest);
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

export const boardService = {
    getAllBoards,
    createNew,
    updateBoardById,
    deleteBoardById,
    getBoardById,
};
