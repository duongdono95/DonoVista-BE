import { StatusCodes } from "http-status-codes";
import { ColumnSchemaZod, NewColumnRequestType } from "../zod/generalTypes";
import { GET_DB } from "../config/mongodb";
import { ObjectId } from "mongodb";
import { BOARD_COLLECTION_NAME } from "./boardModel";

const COLUMN_COLLECTION_NAME = 'columns';
const INVALID_UPDATED_FIELDS = ['_id', 'boardId', 'ownerId' ,'createdAt'];

const createNew = async (createColumnRequest: NewColumnRequestType ) => {
    const validatedRequest = ColumnSchemaZod.safeParse(createColumnRequest);
    if (!validatedRequest.success) {
        throw new Error('Validate Add New Column To Database Failed');
    }
    try {
      // validate the board
        const board = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
          _id: new ObjectId(createColumnRequest.boardId),
        })
        if(!board) throw new Error('Creating New Comlumn Error - Board Not Found')
        // create the column
        const createdColumnResult = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(validatedRequest.data);
        if(!createdColumnResult) throw new Error('Creating New Column Error - Insert To Database Failed')
        // update the board
        await GET_DB().collection(BOARD_COLLECTION_NAME).updateOne(
            { _id: new ObjectId(validatedRequest.data.boardId)},
            {$push: {
                columns: createdColumnResult.insertedId,
                columnOrderIds: createdColumnResult.insertedId
              }}
          )
    } catch (error) {
        throw new Error('Create New Board Failed');
    }
};

export const columnModel = {
    createNew,
    COLUMN_COLLECTION_NAME
};