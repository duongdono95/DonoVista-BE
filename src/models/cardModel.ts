import { ObjectId } from 'mongodb';
import { GET_DB, START_SESSION } from '../config/mongodb';
import { CardSchemaZod } from '../zod/generalTypes';
import { BOARD_COLLECTION_NAME, boardModel } from './boardModel';
import { COLUMN_COLLECTION_NAME, columnModel } from './columnModel';
import { z } from 'zod';

export const CARD_COLLECTION_NAME = 'cards';

const createNew = async (createCardRequest: z.infer<typeof CardSchemaZod>) => {
    const validatedRequest = CardSchemaZod.safeParse(createCardRequest);
    if (!validatedRequest.success) throw new Error('Validate Add New Column To Database Failed');
    try {
        const createdCardResult = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(validatedRequest.data);
        if (!createdCardResult.acknowledged) {
            throw new Error('Failed to insert new card into database');
        }

        const updateColumnCardOrderIds = await GET_DB().collection(COLUMN_COLLECTION_NAME).updateOne(
            { _id: new ObjectId(createCardRequest.columnId) },
            {
                $push: { cardOrderIds: createdCardResult.insertedId.toString()},
            }
        )

        const updateColumnResult = await columnModel.updateAggregateCards(new ObjectId(createCardRequest.columnId));
        const updateBoardResult = await boardModel.updateAggregateColumns(new ObjectId(createCardRequest.boardId));
        console.log(updateColumnResult)
        if(updateColumnResult.code !== 200 || updateBoardResult.code !== 200 || updateColumnCardOrderIds.modifiedCount === 0) throw new Error('Create New Card Failed');

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
            }
        )

        const arrangeCards = await columnModel.updateAggregateCards(columnId);
        const updateBoardResult = await boardModel.updateAggregateColumns(boardId);
        if(arrangeCards.code !== 200 || updateBoardResult.code !== 200 || updateColumnCardOrderIds.modifiedCount === 0) throw new Error('Delete Card Failed');


        return 'Remove Card Successful';
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
            const updateColumnResult = await columnModel.updateAggregateCards(new ObjectId(updateCard.columnId));
            const updateBoardResult = await boardModel.updateAggregateColumns(new ObjectId(updateCard.boardId));
            if(updateColumnResult.code !== 200 || updateBoardResult.code !== 200) throw new Error('Delete Card Failed');
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
