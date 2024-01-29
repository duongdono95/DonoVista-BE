import { z } from 'zod';
import { createNewBoardRequestType } from '../zod/generalTypes';
import { slugify } from '../utils/formatter';
import { boardModel } from '../models/boardModel';

const createNew = async (validatedRequest: z.infer<typeof createNewBoardRequestType>) => {
    try {
        const newBoard = { ...validatedRequest, slug: slugify(validatedRequest.title) };
        const createdBoard = await boardModel.createNew(newBoard);
        if (!createdBoard) throw new Error('Save New Board Failed');
        return await boardModel.findOneById(createdBoard.insertedId);
    } catch (error) {
        throw error;
    }
};
const getAllBoards = async () => {
    try {
        const boards = await boardModel.getAllBoards();
        return boards;
    } catch (error) {
        throw error;
    }
};
export const boardService = {
    createNew,
    getAllBoards,
};
