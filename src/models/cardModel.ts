import { ObjectId } from 'mongodb';
import { GET_DB, START_SESSION } from '../config/mongodb';
import { CardSchemaZodWithID } from '../zod/generalTypes';
import { boardModel } from './boardModel';
import { COLUMN_COLLECTION_NAME, columnModel } from './columnModel';
import { z } from 'zod';

export const CARD_COLLECTION_NAME = 'cards';
const INVALID_UPDATED_FIELDS = ['_id', 'ownerId', 'createdAt'];
const createNew = async (createCardRequest: Omit<z.infer<typeof CardSchemaZodWithID>, '_id'>) => {
    try {
        const createdCardResult = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(createCardRequest);
        if (!createdCardResult.acknowledged) {
            throw new Error('Failed to insert new card into database');
        }
        const updateColumnCardOrderIds = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(createCardRequest.columnId) },
                {
                    $push: {
                        cardOrderIds: createdCardResult.insertedId.toString(),
                        cards: {
                            _id: createdCardResult.insertedId,
                            ...createCardRequest,
                        },
                    },
                },
            );
        const updateBoardResult = await boardModel.updateAggregateColumns(new ObjectId(createCardRequest.boardId));
        if (updateBoardResult.code !== 200 || updateColumnCardOrderIds.modifiedCount === 0)
            throw new Error('Create New Card Failed');

        return 'create New Card Successful';
    } catch (error) {
        throw new Error('Create New Card Failed');
    }
};

const deleteCard = async (cardId: ObjectId, columnId: ObjectId, boardId: ObjectId) => {
    const db = GET_DB();
    try {
        const deleteCardResult = await db.collection(CARD_COLLECTION_NAME).deleteOne({ _id: new ObjectId(cardId) });
        if (deleteCardResult.deletedCount === 0) throw new Error('Delete Card Failed');

        const updateColumnCardOrderIds = await db.collection(COLUMN_COLLECTION_NAME).updateOne(
            { _id: new ObjectId(columnId) },
            {
                $pull: { cardOrderIds: new ObjectId(cardId) },
            },
        );

        const arrangeCards = await columnModel.updateAggregateCards(columnId);
        const updateBoardResult = await boardModel.updateAggregateColumns(boardId);
        if (arrangeCards.code !== 200 || updateBoardResult.code !== 200 || updateColumnCardOrderIds.modifiedCount === 0)
            throw new Error('Delete Card Failed');

        return 'Remove Card Successful';
    } catch (error) {
        throw new Error('Delete Card Failed');
    }
};

const updateCard = async (cardId: ObjectId, updateCard: z.infer<typeof CardSchemaZodWithID>) => {
    try {
        Object.keys(updateCard).forEach((key) => {
            if (INVALID_UPDATED_FIELDS.includes(key)) {
                delete updateCard[key as keyof z.infer<typeof CardSchemaZodWithID>];
            }
        });
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
        const updateColumnResult = await columnModel.updateAggregateCards(new ObjectId(updateCard.columnId));
        const updateBoardResult = await boardModel.updateAggregateColumns(new ObjectId(updateCard.boardId));
        if (updateColumnResult.code !== 200 || updateBoardResult.code !== 200) throw new Error('Delete Card Failed');
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
