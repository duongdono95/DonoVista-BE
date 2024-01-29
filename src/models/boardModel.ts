import { z } from 'zod';
import { boardSchemaType, createNewBoardRequestType } from '../zod/generalTypes';
import { GET_DB } from '../config/mongodb';
import { ObjectId } from 'mongodb';
import { handleNewError } from '../middlewares/errorHandlingMiddleware';
import ApiError from '../utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const BOARD_COLLECTION_NAME = 'boards';

const INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];

const createNew = async (board: z.infer<typeof createNewBoardRequestType>) => {
    const validatedBoard = boardSchemaType.safeParse(board);
    try {
        if (!validatedBoard.success) {
            throw new Error(
                JSON.stringify({
                    message: 'Validate Creating New Board Failed',
                    error: validatedBoard.error.errors,
                }),
            );
        }

        const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validatedBoard.data);
        return createdBoard;
    } catch (error) {
        handleNewError(error);
    }
};

const findOneById = async (id: ObjectId) => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne(id);
        return result;
    } catch (error) {
        handleNewError(error);
    }
};

const getAllBoards = async () => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).find().toArray();
        return result;
    } catch (error) {
        handleNewError(error);
    }
};

export const boardModel = {
    createNew,
    findOneById,
    getAllBoards,
};
