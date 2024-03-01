import { ObjectId } from 'mongodb';
import { GET_DB } from '../config/mongodb';
import { z } from 'zod';
import { ColumnInterface, ColumnSchema } from '../zod/generalTypes';
import { BOARD_COLLECTION_NAME, boardModel } from './boardModel';
import { CARD_COLLECTION_NAME } from './cardModel';

export const COLUMN_COLLECTION_NAME = 'columns';

export const INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];

const createNew = async (column: ColumnInterface) => {
    try {
        const validatedCol = ColumnSchema.omit({ _id: true }).safeParse(column);
        if (!validatedCol.success) throw new Error('Invalid Column');

        const col = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(validatedCol.data);
        if (!col.insertedId) throw new Error('Create New Column Failed!');
        const updateBoard = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .updateOne(
                { id: column.boardId },
                {
                    $push: {
                        columns: { _id: col.insertedId, ...column },
                        columnOrderIds: column.id,
                    },
                },
            );
        if (updateBoard.modifiedCount === 0) throw new Error('Update Board Failed!');

        return { ...column, _id: col.insertedId };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const editColumn = async (column: ColumnInterface) => {
    try {
        const validatedCol = ColumnSchema.omit({ _id: true }).safeParse(column);
        if (!validatedCol.success) throw new Error('Invalid Column');

        const col = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .findOneAndUpdate(
                { id: validatedCol.data.id },
                {
                    $set: {
                        ...validatedCol.data,
                        updatedAt: new Date().toString(),
                    },
                },
            );
        if (!col?._id) throw new Error('Create New Column Failed!');
        const updatteBoard = await boardModel.updateBoardColumns(column.boardId);

        return { ...column, _id: col.insertedId };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteColumn = async (columnId: string) => {
    try {
        const column = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ id: columnId });
        if (!column) throw new Error('Column not found');
        if (column.cardOrderIds && column.cardOrderIds.length > 0) {
            const result = await GET_DB()
                .collection(CARD_COLLECTION_NAME)
                .deleteMany({
                    id: { $in: column.cardOrderIds },
                });
            if (result.deletedCount === 0) throw new Error('Deleted Cards in Column unsucessful');
        }
        const deleteColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteOne({ id: columnId });
        if (deleteColumn.deletedCount === 0) throw new Error('Delete Column unsucessful');
        const updateBoard = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .updateOne(
                { id: column.boardId },
                {
                    $pull: {
                        columns: { id: columnId },
                        columnOrderIds: columnId,
                    },
                },
            );
        // if (updateBoard.modifiedCount === 0) throw new Error('Delete Column unsucessful');
        return deleteColumn;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const updateColumnCards = async (columnId: string) => {
    try {
        const column = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ id: columnId });
        if (!column) throw new Error('Board not found');
        if (column.cardOrderIds.length > 0) {
            const cards = await GET_DB()
                .collection(CARD_COLLECTION_NAME)
                .find({ id: { $in: column.cardOrderIds } })
                .toArray();

            column.cards = cards;
            const updateColumn = await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .updateOne({ _id: new ObjectId(column._id) }, { $set: column });
            if (updateColumn.modifiedCount === 0) throw new Error('Board Update Failed');
            return column;
        }
        return null;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export const columnModel = {
    createNew,
    editColumn,
    deleteColumn,
    updateColumnCards,
};
