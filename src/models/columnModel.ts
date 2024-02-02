import { StatusCodes } from "http-status-codes";
import { ColumnSchemaZod, NewColumnRequestType } from "../zod/generalTypes";
import { GET_DB, START_SESSION } from "../config/mongodb";
import { ObjectId } from "mongodb";
import { BOARD_COLLECTION_NAME } from "./boardModel";

export const COLUMN_COLLECTION_NAME = 'columns';
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
        return createdColumnResult;
    } catch (error) {
        throw new Error('Create New Column Failed');
    }
};

const deleteColumnById = async (columnId: ObjectId, boardId: ObjectId) => {
    if(!columnId) throw new Error('Delete Column Error - Column Id is required')
    const db = GET_DB();
    const session =await START_SESSION();
    try {
        let operationResult = { success: false, message: '' }
         session.startTransaction();
         const deleteColumnResult = await db.collection(COLUMN_COLLECTION_NAME).deleteOne({ _id: columnId }, { session });
         if (deleteColumnResult.deletedCount === 0) {
             throw new Error('Delete Column Error - Column Not Found');
         }

         await db.collection(BOARD_COLLECTION_NAME).updateOne(
             { _id: boardId },
             { $pull: { columnOrderIds: columnId, columns: columnId } },
             { session }
         );
         operationResult = { success: true, message: 'Column deleted successfully' };

         await session.commitTransaction();

        return operationResult;
    } catch (error) {
        await session.abortTransaction();
        throw new Error('Delete Column Failed');
    } finally {
        await session.endSession()
    }
}
const updateColumnById = async (id: ObjectId ,updateColumnRequest: NewColumnRequestType) => {
    try {
        Object.keys(updateColumnRequest).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete updateColumnRequest[key as keyof NewColumnRequestType];
            }
        });
        const result = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateColumnRequest }, { returnDocument: 'after' });
        return result;
    } catch (error) {

    }
}

export const columnModel = {
    createNew,
    COLUMN_COLLECTION_NAME,
    deleteColumnById,
    updateColumnById
};
