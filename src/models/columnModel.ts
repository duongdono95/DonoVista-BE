import { CardSchemaZodWithID, ColumnSchemaZod, ColumnSchemaZodWithId } from '../zod/generalTypes';
import { GET_DB, START_SESSION } from '../config/mongodb';
import { ObjectId } from 'mongodb';
import { BOARD_COLLECTION_NAME, boardModel } from './boardModel';
import { CARD_COLLECTION_NAME, cardModel } from './cardModel';
import { z } from 'zod';

export const COLUMN_COLLECTION_NAME = 'columns';
const INVALID_UPDATED_FIELDS = ['_id', 'ownerId', 'createdAt'];

const createNew = async (createColumnRequest: z.infer<typeof ColumnSchemaZod>) => {
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

        await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(createColumnRequest.boardId) },
                {
                    $push: {
                        columns: {...createColumnRequest, _id: createdColumnResult.insertedId},
                        columnOrderIds: createdColumnResult.insertedId.toString(),
                    },
                },
            );
        return createdColumnResult;
    } catch (error) {
        throw new Error('Create New Column Failed');
    }
};

const getColumnById = async (id: string) => {
    try {
        const column = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                        _destroy: false,
                    },
                },
                {
                    $lookup: {
                        from: CARD_COLLECTION_NAME,
                        let: { columnId: { $toString: '$_id' } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ['$columnId', '$$columnId'] }, { $eq: ['$_destroy', false] }],
                                    },
                                },
                            },
                        ],
                        as: 'cards',
                    },
                },
            ])
            .toArray();
        const newColumn = column[0];
        updateColumnById(new ObjectId(newColumn._id), newColumn as z.infer<typeof ColumnSchemaZod>);
        return newColumn;
    } catch (error) {
        throw new Error('Get Column By Id Failed');
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
const updateColumnById = async (id: ObjectId, updateColumnRequest: z.infer<typeof ColumnSchemaZod>) => {
    try {
        Object.keys(updateColumnRequest).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete updateColumnRequest[key as keyof z.infer<typeof ColumnSchemaZod>];
            }
        });
        const columnUpdateResult = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { ...updateColumnRequest, updatedAt: new Date().toString() } },
                { returnDocument: 'after' },
            );
        if (!columnUpdateResult) throw new Error('Update Column Failed');

        return columnUpdateResult;
    } catch (error) {}
};
const updateColumnCards = async (
    startColumn: z.infer<typeof ColumnSchemaZodWithId>,
    endColumn: z.infer<typeof ColumnSchemaZodWithId>,
    activeCard: z.infer<typeof CardSchemaZodWithID>,
) => {
    const session = await START_SESSION();
    const startColumnId = startColumn._id;
    const endColumnId = endColumn._id;
    const activeCardId = activeCard._id;
    try {
        session.startTransaction();
        Object.keys(startColumn).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete startColumn[key as keyof z.infer<typeof ColumnSchemaZod>];
            }
        });
        Object.keys(endColumn).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete endColumn[key as keyof z.infer<typeof ColumnSchemaZod>];
            }
        });
        Object.keys(activeCard).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete activeCard[key as keyof z.infer<typeof CardSchemaZodWithID>];
            }
        });
        if (startColumnId === endColumnId) {
            const test = await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .findOneAndUpdate(
                    { _id: new ObjectId(startColumnId) },
                    {
                        $set: {
                            ...startColumn,
                            updatedAt: new Date().toString(),
                        },
                    },
                    { session },
                );
        } else {
            const result1 = await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .findOneAndUpdate(
                    { _id: new ObjectId(startColumnId) },
                    {
                        $set: {
                            ...startColumn,
                            updatedAt: new Date().toString(),
                        },
                    },
                    { session },
                );
            const result2 = await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .findOneAndUpdate(
                    { _id: new ObjectId(endColumnId) },
                    {
                        $set: {
                            ...endColumn,
                            updatedAt: new Date().toString(),
                        },
                    },
                    { session },
                );
            const result3 = await GET_DB()
                .collection(CARD_COLLECTION_NAME)
                .findOneAndUpdate(
                    { _id: new ObjectId(activeCardId) },
                    {
                        $set: {
                            ...activeCard,
                            updatedAt: new Date().toString(),
                        },
                    },
                    { session },
                );
        }
        boardModel.getBoardById(endColumn.boardId);
        await session.commitTransaction();
        return { message: 'Update Column Successfully' };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};
export const columnModel = {
    COLUMN_COLLECTION_NAME,
    createNew,
    getColumnById,
    deleteColumnById,
    updateColumnById,
    updateColumnCards,
};
