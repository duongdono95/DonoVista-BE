
import { ColumnSchemaType, ColumnSchemaZod, NewColumnRequestType } from '../zod/generalTypes';
import { GET_DB, START_SESSION } from '../config/mongodb';
import { ObjectId } from 'mongodb';
import { BOARD_COLLECTION_NAME, boardModel } from './boardModel';
import { CARD_COLLECTION_NAME } from './cardModel';

export const COLUMN_COLLECTION_NAME = 'columns';
const INVALID_UPDATED_FIELDS = ['_id', 'boardId', 'ownerId', 'createdAt'];

const createNew = async (createColumnRequest: ColumnSchemaType) => {

    try {
        // validate the board
        const board = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .findOne({
                _id: new ObjectId(createColumnRequest.boardId),
            });
        if (!board) throw new Error('Creating New Comlumn Error - Board Not Found');
        // create the column
        const createdColumnResult = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(createColumnRequest);
        if (!createdColumnResult) throw new Error('Creating New Column Error - Insert To Database Failed');
        // update the board
        const newColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: createdColumnResult.insertedId });
        await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(createColumnRequest.boardId) },
                {
                    $push: {
                        columns: newColumn,
                        columnOrderIds: createdColumnResult.insertedId,
                    },
                },
            );
        return createdColumnResult;
    } catch (error) {
        throw new Error('Create New Column Failed');
    }
};

const deleteColumnById = async (columnId: ObjectId, boardId: ObjectId) => {
    if (!columnId) throw new Error('Delete Column Error - Column Id is required');
    const db = GET_DB();
    const session = await START_SESSION();
    let operationResult = { success: false, message: '' };
    try {
        session.startTransaction();

        const column = await db.collection(COLUMN_COLLECTION_NAME).findOne({ _id: columnId }, { session });
        if (!column) throw new Error('Column not found');

        if (column.cardOrderIds && column.cardOrderIds.length > 0) {
            await db.collection(CARD_COLLECTION_NAME).deleteMany(
                {
                    _id: {
                        $in: column.cardOrderIds.map((id: string) => new ObjectId(id)),
                    },
                },
                { session },
            );
        }

        const deleteColumnResult = await db
            .collection(COLUMN_COLLECTION_NAME)
            .deleteOne({ _id: columnId }, { session });
        if (deleteColumnResult.deletedCount === 0) {
            throw new Error('Delete Column Error - Column Not Found');
        }

        await db
            .collection(BOARD_COLLECTION_NAME)
            .updateOne({ _id: boardId }, { $pull: { columnOrderIds: columnId, columns: columnId } }, { session });
        operationResult = { success: true, message: 'Column deleted successfully' };

        await session.commitTransaction();

        return operationResult;
    } catch (error) {
        await session.abortTransaction();
        throw new Error('Delete Column Failed');
    } finally {
        await session.endSession();
    }
};
const updateColumnById = async (id: ObjectId, updateColumnRequest: ColumnSchemaType) => {
    try {
        Object.keys(updateColumnRequest).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete updateColumnRequest[key as keyof ColumnSchemaType];
            }
        });
        const columnUpdateResult  = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateColumnRequest }, { returnDocument: 'after' });
        if(!columnUpdateResult) throw new Error('Update Column Failed');
        const board = await boardModel.findOneById(new ObjectId(columnUpdateResult.boardId))
        if(!board) throw new Error('Update Column Failed - Board Not Found');
        const updatedBoard = board.columns.map((column: any) => (column._id.toString() === columnUpdateResult._id.toString() ? columnUpdateResult : column))
        const updatedBoardResult = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            {
                _id: new ObjectId(columnUpdateResult.boardId),
            }, {
                $set: {
                    columns: updatedBoard,
                },
            }, { returnDocument: 'after'
        })
        return updatedBoardResult ;
    } catch (error) {}
};

export const columnModel = {
    createNew,
    COLUMN_COLLECTION_NAME,
    deleteColumnById,
    updateColumnById,
};
