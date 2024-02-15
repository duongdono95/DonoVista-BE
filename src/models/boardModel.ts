import { z } from 'zod';
import { BoardSchemaZodWithId } from '../zod/generalTypes';
import { GET_DB, START_SESSION } from '../config/mongodb';
import { ObjectId } from 'mongodb';
import { COLUMN_COLLECTION_NAME, columnModel } from './columnModel';
import { CARD_COLLECTION_NAME, cardModel } from './cardModel';

export const BOARD_COLLECTION_NAME = 'boards';

const INVALID_UPDATED_FIELDS = ['_id', 'ownerId', 'createdAt'];

const getAllBoards = async () => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).find().sort({ createdAt: -1 }).toArray();
        return result;
    } catch (error) {
        throw new Error('Get All Boards Failed');
    }
};

const createNew = async (board: Omit<z.infer<typeof BoardSchemaZodWithId>, '_id'>) => {
    try {
        const createdBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(board);
        return createdBoard;
    } catch (error) {
        throw new Error('Create New Board Failed');
    }
};

const getBoardById = async (id: ObjectId) => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne(id);
        if (!result) throw new Error('Board not found');
        return result;
    } catch (error) {
        throw new Error('Find required Board By Id Failed');
    }
};

const updateOneById = async (id: ObjectId, updatedData: z.infer<typeof BoardSchemaZodWithId>) => {
    try {
        Object.keys(updatedData).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete updatedData[key as keyof z.infer<typeof BoardSchemaZodWithId>];
            }
        });

        const result = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { ...updatedData, updatedAt: new Date().toString() } },
                { returnDocument: 'after' },
            );
        return result;
    } catch (error) {
        throw new Error('Update Board Failed');
    }
};

const deleteOneById = async (id: string) => {
    const db = GET_DB();
    try {
        const board = await db.collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
        if (!board) throw new Error('Board not found');
        if (board.columnOrderIds && board.columnOrderIds.length > 0) {
            const columns = await db
                .collection(COLUMN_COLLECTION_NAME)
                .find({
                    _id: {
                        $in: board.columnOrderIds.map((id: string) => new ObjectId(id)),
                    },
                })
                .toArray();

            const allCardIds = columns.reduce((acc, column) => {
                if (column.cardOrderIds && column.cardOrderIds.length > 0) {
                    const cardIds = column.cardOrderIds.map((id: string) => new ObjectId(id));
                    return acc.concat(cardIds);
                }
                return acc;
            }, []);

            if (allCardIds.length > 0) {
                await db.collection(CARD_COLLECTION_NAME).deleteMany({
                    _id: { $in: allCardIds },
                });
            }
            await db.collection(COLUMN_COLLECTION_NAME).deleteMany({
                _id: {
                    $in: board.columnOrderIds.map((id: string) => new ObjectId(id)),
                },
            });
        }
        const result = await db.collection(BOARD_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });

        return result;
    } catch (error) {
        throw new Error('Delete Board Failed');
    }
};

const updateAggregateColumns = async (id: ObjectId) => {
    try {
        const boardColumns = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                        _destroy: false,
                    },
                },
                {
                    $lookup: {
                        from: columnModel.COLUMN_COLLECTION_NAME,
                        let: { boardId: { $toString: '$_id' } },
                        pipeline: [{ $match: { $expr: { $eq: ['$boardId', '$$boardId'] } } }],
                        as: 'columns',
                    },
                },
            ])
            .toArray();
        if (!boardColumns[0]) throw new Error('Board not found');
        const updateBoardResult = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .updateOne({ _id: new ObjectId(id) }, { $set: { columns: boardColumns[0].columns } });

        if (updateBoardResult.modifiedCount === 0) throw new Error('Update Board Failed');
        return {
            code: 200,
            message: 'Update Board Columns Success',
        };
    } catch (error) {
        throw new Error('Get Board Failed');
    }
};
export const boardModel = {
    createNew,
    getAllBoards,
    updateOneById,
    deleteOneById,
    getBoardById,
    updateAggregateColumns,
};
