import { ObjectId } from 'mongodb';
import { GET_DB } from '../config/mongodb';
import {
    BoardInterface,
    BoardSchema,
    CardInterface,
    CardSchema,
    ColumnInterface,
    ColumnSchema,
} from '../zod/generalTypes';
import { COLUMN_COLLECTION_NAME } from './columnModel';
import { CARD_COLLECTION_NAME } from './cardModel';

export const BOARD_COLLECTION_NAME = 'boards';

export const INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];

const createNew = async (req: Omit<BoardInterface, '_id'>) => {
    try {
        const validateUser = await GET_DB().collection(BOARD_COLLECTION_NAME).find({ id: req.ownerId });
        if (!validateUser) throw new Error('User not found');
        const newBoard = await GET_DB().collection('boards').insertOne(req);
        if (!newBoard.insertedId) throw new Error('Create New Board failed');
        return { ...req, _id: newBoard.insertedId };
    } catch (error) {
        throw error;
    }
};

const allBoards = async (userId: string) => {
    try {
        const boards = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .find({ ownerId: userId })
            .sort({ createdAt: -1 })
            .toArray();
        return boards;
    } catch (error) {
        throw error;
    }
};

const getBoard = async (boardId: ObjectId) => {
    try {
        const board = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: boardId });
        if (!board) throw new Error('Board not found');
        return board;
    } catch (error) {
        throw error;
    }
};

const updateBoard = async (board: BoardInterface) => {
    try {
        const validatedBoard = BoardSchema.omit({ _id: true, createdAt: true }).safeParse(board);

        if (!validatedBoard.success) throw new Error('Validated Board Failed');
        const result = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(board._id) },
                { $set: { ...validatedBoard.data, updatedAt: new Date().toString() } },
                { returnDocument: 'after' },
            );
        if (!result) throw new Error('Board not found');
        return result;
    } catch (error) {
        throw error;
    }
};

const updateBoardColumns = async (boardId: string) => {
    try {
        const board = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ id: boardId });
        if (!board) throw new Error('Board not found');
        if (board.columnOrderIds.length > 0) {
            const columns = await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .find({ id: { $in: board.columnOrderIds } })
                .toArray();

            board.columns = columns;
            const updateBoard = await GET_DB()
                .collection(BOARD_COLLECTION_NAME)
                .updateOne({ _id: new ObjectId(board._id) }, { $set: { columns: columns } });
            if (updateBoard.modifiedCount === 0) throw new Error('Board Update Failed');
            return board;
        }
        return null;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteBoard = async (boardId: string) => {
    try {
        const board = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(boardId) });
        if (!board) throw new Error('Board not found');
        if (board.columnOrderIds && board.columnOrderIds.length > 0) {
            const columns = await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .find({
                    id: {
                        $in: board.columnOrderIds,
                    },
                })
                .toArray();

            const allCardIds = columns.reduce((acc, column) => {
                if (column.cardOrderIds && column.cardOrderIds.length > 0) {
                    const cardIds = column.cardOrderIds.map((id: string) => id);
                    return acc.concat(cardIds);
                }
                return acc;
            }, []);

            if (allCardIds.length > 0) {
                await GET_DB()
                    .collection(CARD_COLLECTION_NAME)
                    .deleteMany({
                        id: { $in: allCardIds },
                    });
            }
            await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .deleteMany({
                    id: {
                        $in: board.columnOrderIds,
                    },
                });
        }
        const result = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .deleteOne({ _id: new ObjectId(board._id) });

        return result;
    } catch (error) {
        throw error;
    }
};

const aggregateColumn = async (boardId: ObjectId) => {
    try {
        const boardColumns = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(boardId),
                        _destroy: false,
                    },
                },
                {
                    $lookup: {
                        from: COLUMN_COLLECTION_NAME,
                        let: { boardId: { $toString: '$_id' } },
                        pipeline: [{ $match: { $expr: { $eq: ['$boardId', '$$boardId'] } } }],
                        as: 'columns',
                    },
                },
            ])
            .toArray();
        if (!boardColumns[0]) throw new Error('No Column was found');
        const updateBoardResult = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .updateOne({ _id: new ObjectId(boardId) }, { $set: { columns: boardColumns[0].columns } });

        if (updateBoardResult.modifiedCount === 0) throw new Error('Update Board Failed');
        return {
            code: 200,
            message: 'Update Board Columns Success',
            data: boardColumns[0],
        };
    } catch (error) {
        throw new Error('Get Board Failed');
    }
};

const duplicate = async (
    originalColumn: null | ColumnInterface,
    newColumn: ColumnInterface,
    activeCard: CardInterface | null,
) => {
    try {
        const validatedNewCol = ColumnSchema.omit({ _id: true, createdAt: true }).safeParse(newColumn);
        const validatedOriginalColumn = ColumnSchema.omit({ _id: true, createdAt: true }).safeParse(originalColumn);
        const validatedActiveCard = CardSchema.omit({ _id: true, createdAt: true }).safeParse(activeCard);
        console.log('==================================')
        console.log(validatedNewCol)
        console.log(validatedOriginalColumn)
        console.log(validatedActiveCard)
        console.log('==================================')
        if (validatedNewCol.success && !originalColumn && !activeCard) {
            const newCol = validatedNewCol.data;
            if (newCol.cards && newCol.cards.length > 0) {
                const insertAllCards = await GET_DB()
                    .collection(CARD_COLLECTION_NAME)
                    .insertMany(newCol.cards.map((card) => ({ ...card, _id: new ObjectId() })));
                if (insertAllCards.insertedCount !== newCol.cards.length) throw new Error('Create new Card(s) Failed');
                const insertNewCol = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newCol);
                if (!insertNewCol.insertedId) throw new Error('Create new Column Failed.');
                const updateBoard = await GET_DB()
                    .collection(BOARD_COLLECTION_NAME)
                    .updateOne(
                        { id: newCol.boardId },
                        {
                            $push: {
                                columnOrderIds: newCol.id,
                                columns: { ...newCol, _id: new ObjectId(insertNewCol.insertedId) },
                            },
                        },
                    );
            }
            return '';
        }
        if (
            originalColumn &&
            validatedOriginalColumn.success &&
            activeCard &&
            validatedActiveCard.success &&
            validatedNewCol.success
        ) {
            const updateOriginalCol = await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .updateOne(
                    { id: originalColumn?.id },
                    {
                        $set: {
                            ...validatedOriginalColumn.data,
                            createdAt: new Date().toString(),
                        },
                    },
                );

            if (updateOriginalCol.modifiedCount === 0) throw new Error('Update Column Failed');
            console.log('test 1');
            console.log(validatedActiveCard);
            const updateCard = await GET_DB()
                .collection(CARD_COLLECTION_NAME)
                .updateOne(
                    { id: validatedActiveCard.data.id },
                    { $set: { ...validatedActiveCard.data, updatedAt: new Date().toString() } },
                );
            console.log(updateCard);
            if (updateCard.modifiedCount === 0) throw new Error('Create new Card Failed');
            console.log('test 2');
            const insertNewCol = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(validatedNewCol.data);
            if (!insertNewCol.insertedId) throw new Error('Create new Column Failed');
            console.log(insertNewCol.insertedId);
            console.log(validatedNewCol.data.boardId);
            const updateBoard = await GET_DB()
                .collection(BOARD_COLLECTION_NAME)
                .updateOne(
                    { id: validatedNewCol.data.boardId },
                    {
                        $push: {
                            columnOrderIds: validatedNewCol.data.id,
                            columns: { ...validatedNewCol.data, _id: new ObjectId(insertNewCol.insertedId) },
                        },
                    },
                );
            console.log(updateBoard);
            await boardModel.updateBoardColumns(newColumn.boardId);

            return '';
        }
    } catch (error) {
        throw error;
    }
};
export const boardModel = {
    createNew,
    allBoards,
    getBoard,
    updateBoard,
    deleteBoard,
    aggregateColumn,
    updateBoardColumns,
    duplicate,
};
