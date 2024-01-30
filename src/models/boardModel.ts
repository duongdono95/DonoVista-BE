import { z } from 'zod';
import { BoardSchemaType, BoardSchemaZod, NewBoardRequestType, NewBoardRequestZod } from '../zod/generalTypes'
import { GET_DB } from '../config/mongodb';
import { ObjectId } from 'mongodb';
import { handleNewError } from '../middlewares/errorHandlingMiddleware';
import ApiError from '../utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const BOARD_COLLECTION_NAME = 'boards';

const INVALID_UPDATED_FIELDS = ['_id', 'createdAt']

const getAllBoards = async () => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).find().sort({createdAt: -1}).toArray();
        return result;
    } catch (error) {
        throw new Error('Get All Boards Failed')
    }
};

const createNew = async (board: z.infer<typeof NewBoardRequestZod>) => {
    const validatedBoard = BoardSchemaZod.safeParse(board);
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
        throw new Error('Create New Board Failed')
    }
};

const findOneById = async (id: ObjectId) => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne(id);
        return result;
    } catch (error) {
        throw new Error('Find required Board By Id Failed')
    }
};

const updateOneById = async (id: ObjectId, updatedData: NewBoardRequestType) => {
    try {
        Object.keys(updatedData).forEach((key) => {
            if(INVALID_UPDATED_FIELDS.includes(key)) {
               delete updatedData[key as keyof NewBoardRequestType]
            }
        })
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: updatedData},
            {returnDocument: 'after'}
        )
        return result;
    } catch (error) {
        throw new Error('Update Board Failed')
    }
}

export const boardModel = {
    createNew,
    findOneById,
    getAllBoards,
    updateOneById
};
