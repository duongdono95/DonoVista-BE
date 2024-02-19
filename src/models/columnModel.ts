import { CardSchemaZodWithID, ColumnSchemaZodWithId } from '../zod/generalTypes';
import { GET_DB, START_SESSION } from '../config/mongodb';
import { ObjectId } from 'mongodb';
import { BOARD_COLLECTION_NAME, boardModel } from './boardModel';
import { CARD_COLLECTION_NAME, cardModel } from './cardModel';
import { z } from 'zod';

export const COLUMN_COLLECTION_NAME = 'columns';
const INVALID_UPDATED_FIELDS = ['_id', 'ownerId', 'createdAt'];

const createNew = async (createColumnRequest: Omit<z.infer<typeof ColumnSchemaZodWithId>, '_id'>) => {
    try {
        const createdColumnResult = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(createColumnRequest);
        if (!createdColumnResult) throw new Error('Creating New Column Error - Insert To Database Failed');
        const updateBoardResult = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(createColumnRequest.boardId) },
                {
                    $push: {
                        columns: { _id: createdColumnResult.insertedId, ...createColumnRequest },
                        columnOrderIds: createdColumnResult.insertedId.toString(),
                    },
                },
            );
        if (!updateBoardResult.acknowledged) throw new Error('Creating New Column Error - Update Board Failed');
        return 'Create New Column Successfully';
    } catch (error) {
        throw new Error('Create New Column Failed');
    }
};

const deleteColumnById = async (columnId: ObjectId, boardId: ObjectId) => {
    const db = GET_DB();
    try {
        const column = await db.collection(COLUMN_COLLECTION_NAME).findOne({ _id: columnId });
        if (!column) throw new Error('Column not found');
        if (column.cardOrderIds && column.cardOrderIds.length > 0) {
            await db.collection(CARD_COLLECTION_NAME).deleteMany({
                _id: {
                    $in: column.cardOrderIds.map((id: string) => new ObjectId(id)),
                },
            });
        }

        const deleteColumnResult = await db.collection(COLUMN_COLLECTION_NAME).deleteOne({ _id: columnId });
        if (deleteColumnResult.deletedCount === 0) {
            throw new Error('Delete Column Error - Column Not Found');
        }
        const updateBoardColumnsOrderIds = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .updateOne(
                { _id: boardId },
                {
                    $pull: {
                        columnOrderIds: columnId.toString(),
                    },
                },
            );
        if (updateBoardColumnsOrderIds.modifiedCount === 0)
            throw new Error('Delete Column failed - Update Board Failed');
        const updateBoardColumns = await boardModel.updateAggregateColumns(new ObjectId(boardId));
        if (updateBoardColumns.code !== 200) throw new Error('Delete Column failed - Update Board Failed');
        return 'Delete Column Successfully';
    } catch (error) {
        throw new Error('Delete Column Failed');
    }
};
const updateColumnById = async (id: ObjectId, updateColumnRequest: z.infer<typeof ColumnSchemaZodWithId>) => {
    try {
        Object.keys(updateColumnRequest).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete updateColumnRequest[key as keyof z.infer<typeof ColumnSchemaZodWithId>];
            }
        });
        const updateColumnResult = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .findOneAndUpdate(
                {
                    _id: new ObjectId(id),
                },
                {
                    $set: {
                        ...updateColumnRequest,
                        updatedAt: new Date().toString(),
                    },
                },
                { returnDocument: 'after' },
            );
        await boardModel.updateAggregateColumns(new ObjectId(updateColumnRequest.boardId));
        if (!updateColumnResult) throw new Error('Update Column Failed');
        return updateColumnResult;
    } catch (error) {
        throw new Error('Update Column failed');
    }
};
const arrangeCards = async (
    startColumn: z.infer<typeof ColumnSchemaZodWithId>,
    endColumn: z.infer<typeof ColumnSchemaZodWithId>,
    activeCard: z.infer<typeof CardSchemaZodWithID>,
) => {
    const startColumnId = startColumn._id;
    const endColumnId = endColumn._id;
    const activeCardId = activeCard._id;
    try {
        Object.keys(startColumn).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete startColumn[key as keyof z.infer<typeof ColumnSchemaZodWithId>];
            }
        });
        Object.keys(endColumn).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete endColumn[key as keyof z.infer<typeof ColumnSchemaZodWithId>];
            }
        });
        Object.keys(activeCard).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete activeCard[key as keyof z.infer<typeof CardSchemaZodWithID>];
            }
        });
        if (startColumnId !== endColumnId) {
            const updateEndColumn = await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .updateOne(
                    { _id: new ObjectId(endColumnId) },
                    {
                        $set: {
                            ...endColumn,
                            updatedAt: new Date().toString(),
                        },
                    },
                );
            const updateCard = await GET_DB()
                .collection(CARD_COLLECTION_NAME)
                .updateOne(
                    { _id: new ObjectId(activeCardId) },
                    {
                        $set: {
                            ...activeCard,
                            updatedAt: new Date().toString(),
                        },
                    },
                );
        }
        const updateStartedColumn = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(startColumnId) },
                {
                    $set: {
                        ...startColumn,
                        updatedAt: new Date().toString(),
                    },
                },
            );
        const updateColumnResult = await updateAggregateCards(new ObjectId(endColumnId));
        const updateBoardResult = await boardModel.updateAggregateColumns(new ObjectId(startColumn.boardId));
        if (updateBoardResult.code !== 200 || updateColumnResult.code !== 200) throw new Error('Update Column Failed');
        return { message: 'Update Column Successfully' };
    } catch (error) {
        throw error;
    }
};

const duplicateColumn = async (
    validatedNewColumn: z.infer<typeof ColumnSchemaZodWithId>,
    validatedOriginalColumn?: z.infer<typeof ColumnSchemaZodWithId>,
    validatedActiveCard?: z.infer<typeof CardSchemaZodWithID>,
) => {
    const { _id: columnId, cards, ...restColumn } = validatedNewColumn;
    const newColumnId = new ObjectId();
    let duplicatedCards = [];
    let newCardOrderIds = [];
    try {

        // ------------------ Create New Cards in required Column ------------------
        if (validatedNewColumn.cards.length > 0 && !validatedOriginalColumn && !validatedActiveCard) {
            for (const card of cards) {
                const { _id, ...rest } = card;
                const newCard = {
                    ...rest,
                    columnId: new ObjectId(newColumnId).toString(),
                    _id: new ObjectId(),
                };
                const addNewCardResult = await GET_DB().collection('cards').insertOne(newCard);
                if (!addNewCardResult.insertedId) throw new Error('Duplicate Column Failed');
                duplicatedCards.push(newCard);
                newCardOrderIds.push(newCard._id.toString());
            }
        }
        if (validatedActiveCard && validatedOriginalColumn) {
            const originalColumnCards = validatedOriginalColumn.cards.filter(
                (card) => card._id !== validatedActiveCard._id,
            );
            const updateOriginalColumnResult = await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .updateOne(
                    { _id: new ObjectId(validatedOriginalColumn._id) },
                    {
                        $set: {
                            cards: originalColumnCards,
                            cardOrderIds: originalColumnCards.map((card) => card._id.toString()),
                            updatedAt: new Date().toISOString(),
                        },
                    },
                );
            const updateActiveCardResult = await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .updateOne(
                    { _id: new ObjectId(validatedActiveCard._id) },
                    {
                        $set: {
                            columnId: newColumnId.toString(),
                            updatedAt: new Date().toISOString(),
                        },
                    },
                );
            if (updateOriginalColumnResult.modifiedCount === 0) throw new Error('Duplicate Column Failed');
            await boardModel.updateAggregateColumns(new ObjectId(validatedOriginalColumn.boardId));
            duplicatedCards.push({ ...validatedActiveCard, columnId: newColumnId.toString() });
            newCardOrderIds.push(validatedActiveCard._id.toString());
        }
        const newColumnWithId = {
            ...restColumn,
            cards: duplicatedCards,
            cardOrderIds: newCardOrderIds,
            title: validatedActiveCard ? 'New Column' : `${restColumn.title}`,
            createdAt: new Date().toString(),
            _id: new ObjectId(newColumnId),
        };
        const createNewColumnResult = await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(newColumnWithId);
        if (!createNewColumnResult.insertedId) throw new Error('Duplicate Column Failed');

        const updateBoardResult = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(validatedNewColumn.boardId) },
                {
                    $push: {
                        columns: newColumnWithId as any,
                        columnOrderIds: newColumnWithId._id.toString() as any,
                    },

                    $set: { updatedAt: new Date().toISOString() },
                },
            );
        if (updateBoardResult.modifiedCount === 0) throw new Error('Duplicate Column Failed');
        return newColumnWithId;
    } catch (error) {
        throw new Error('Duplicate Column Failed');
    }
};

const updateAggregateCards = async (id: ObjectId) => {
    try {
        const cards = await GET_DB()
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
                        as: 'cards',
                        pipeline: [{ $match: { $expr: { $eq: ['$columnId', '$$columnId'] } } }],
                    },
                },
            ])
            .toArray();
        if (!cards[0]) throw new Error('Column not found');

        const updateColumnResult = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .updateOne({ _id: new ObjectId(id) }, { $set: { cards: cards[0].cards } });
        if (updateColumnResult.modifiedCount === 0) throw new Error('Update Column Failed');

        return {
            code: 200,
            message: 'Update Column Cards Success',
        };
    } catch (error) {
        throw new Error('Get Board Failed');
    }
};

export const columnModel = {
    COLUMN_COLLECTION_NAME,
    createNew,
    deleteColumnById,
    updateColumnById,
    arrangeCards,
    duplicateColumn,
    updateAggregateCards,
};
