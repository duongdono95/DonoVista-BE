import { ObjectId } from 'mongodb';
import { GET_DB, START_SESSION } from '../config/mongodb';
import { CardSchemaZod } from '../zod/generalTypes';
import { BOARD_COLLECTION_NAME, boardModel } from './boardModel';
import { COLUMN_COLLECTION_NAME, columnModel } from './columnModel';
import { z } from 'zod';

export const CARD_COLLECTION_NAME = 'cards';

const createNew = async (createCardRequest: z.infer<typeof CardSchemaZod>) => {
    const validatedRequest = CardSchemaZod.safeParse(createCardRequest);
    if (!validatedRequest.success) {
        throw new Error('Validate Add New Column To Database Failed');
    }
    try {
        const createdCardResult = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(validatedRequest.data);
        if (!createdCardResult.acknowledged) {
            throw new Error('Failed to insert new card into database');
        }
        // Update the Column
        const updateColumnResult = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(createCardRequest.columnId) },
                {
                    $push: {
                        cardOrderIds: createdCardResult.insertedId.toString(),
                        cards: { ...createCardRequest, _id: createdCardResult.insertedId },
                    },
                },
            );
        return 'create New Card Successful';
    } catch (error) {
        throw new Error('Create New Card Failed');
    }
};

const deleteCard = async (cardId: ObjectId, columnId: ObjectId, boardId: ObjectId) => {
    const db = GET_DB();
    let operationResult = { success: false, message: '' };
    try {
        const board = await db.collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(boardId) });
        if (!board) throw new Error('Delete Card Failed - Board Not Found');

        const column = await db.collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(columnId) });
        if (!column) throw new Error('Delete Card Failed - Column Not Found');

        const card = await db.collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(cardId) });
        if (!card) throw new Error('Delete Card Failed - Column Not Found');

        if (!column.cardOrderIds.toString().includes(cardId))
            throw new Error('Delete Card Failed - Card Not Found In Required Column');
        const deleteCardResult = await db.collection(CARD_COLLECTION_NAME).deleteOne({ _id: new ObjectId(cardId) });
        await db.collection(COLUMN_COLLECTION_NAME).updateOne(
            {
                _id: new ObjectId(columnId),
            },
            {
                $pull: { cardOrderIds: cardId.toString(), cards: card },
            },
        );
        if (deleteCardResult.deletedCount === 0) throw new Error('Delete Card Failed');
        operationResult = {
            success: true,
            message: 'Card deleted successfully',
        };
        return operationResult;
    } catch (error) {
        throw new Error('Delete Card Failed');
    }
};

const updateCard = async (cardId: ObjectId, updateCard: z.infer<typeof CardSchemaZod>) => {
    try {
        const updateCardResult = await GET_DB()
            .collection(CARD_COLLECTION_NAME)
            .findOneAndUpdate(
                { _id: new ObjectId(cardId) },
                {
                    $set: {
                        ...updateCard,
                        updatedAt: new Date().toString(),
                    },
                },
                { returnDocument: 'after' },
            );
        columnModel.getColumnById(updateCard.columnId);
        return updateCardResult;
    } catch (error) {
        throw error;
    }
};

export const cardModel = {
    createNew,
    CARD_COLLECTION_NAME,
    deleteCard,
    updateCard,
};
