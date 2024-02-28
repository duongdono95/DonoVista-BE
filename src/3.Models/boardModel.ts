import { ObjectId } from 'mongodb';
import { GET_DB } from '../config/mongodb';
import { BoardInterface } from "../zod/generalTypes";
import { COLUMN_COLLECTION_NAME } from "./columnModel";
import { CARD_COLLECTION_NAME } from "./cardModel";

export const BOARD_COLLECTION_NAME = 'boards';

export const INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];

const createNew = async (req:  Omit<BoardInterface, '_id'>) => {
    try {
        const validateUser = await GET_DB().collection(BOARD_COLLECTION_NAME).find({_id: new ObjectId(req.ownerId) });
        if(!validateUser) throw new Error('User not found')
        const newBoard = await GET_DB().collection('boards').insertOne(req);
        if(!newBoard.insertedId) throw new Error('Create New Board failed')
        return {
            code: 200,
            message: 'Create New Board Successfully',
            data: newBoard.insertedId
        }
    } catch (error) {
        throw error;
    }
};

const allBoards = async (userId: ObjectId) => {
    try {
        const boards = await GET_DB().collection(BOARD_COLLECTION_NAME).find({ownerId: userId}).toArray();
        return {
            code: 200,
            message: 'Create New Board Successfully',
            data: boards
        }
    } catch (error) {
        throw error;
    }
};

const getBoard = async (boardId: ObjectId) => {
    try {
        const boards = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({_id: boardId});
        if(!boards) throw new Error('Board not found')
        return {
            code: 200,
            message: 'Create New Board Successfully',
            data: boards
        }
    } catch (error) {
        throw error;
    }
};

const updateBoard = async (updatedBoard: BoardInterface) => {
    try {
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(updatedBoard._id) },
            { $set: { ...updatedBoard, updatedAt: new Date().toString() } },
            { returnDocument: 'after' },
        );
        if(!result) throw new Error('Board not found')
        return {
            code: 200,
            message: 'Create New Board Successfully',
            data: result
        }
    } catch (error) {
        throw error;
    }
};


const deleteBoard = async (board: BoardInterface) => {
    try {

        if (board.columnOrderIds && board.columnOrderIds.length > 0) {
            const columns = await GET_DB()
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
                await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({
                    _id: { $in: allCardIds },
                });
            }
            await GET_DB().collection(COLUMN_COLLECTION_NAME).deleteMany({
                _id: {
                    $in: board.columnOrderIds.map((id: string) => new ObjectId(id)),
                },
            });
        }
        const result = await GET_DB().collection(BOARD_COLLECTION_NAME).deleteOne({ _id: new ObjectId(board._id) });

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

export const boardModel = {
    createNew,
    allBoards,
    getBoard,
    updateBoard,
    deleteBoard
};