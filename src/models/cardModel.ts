import { ObjectId } from 'mongodb';
import { GET_DB, START_SESSION } from '../config/mongodb';
import { CardSchemaZod } from '../zod/generalTypes';
import { BOARD_COLLECTION_NAME } from './boardModel';
import { COLUMN_COLLECTION_NAME, columnModel } from './columnModel';
import { z } from 'zod';

export const CARD_COLLECTION_NAME = 'cards';

const createNew = async (createCardRequest: z.infer<typeof CardSchemaZod>) => {
    const validatedRequest = CardSchemaZod.safeParse(createCardRequest);
    if (!validatedRequest.success) {
        throw new Error('Validate Add New Column To Database Failed');
    }
    const session = await START_SESSION();
    try {
        session.startTransaction();
        // validate the board
        const board = await GET_DB()
            .collection(BOARD_COLLECTION_NAME)
            .findOne({
                _id: new ObjectId(validatedRequest.data.boardId),
            });
        if (!board) throw new Error('Creating New Comlumn Error - Board Not Found');

        // Validate the columnId
        const column = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .findOne({ _id: new ObjectId(validatedRequest.data.columnId) }, { session });
        if (!column) throw new Error('Creating New Comlumn Error - Column Not Found In Requied Board');
        if (!board.columnOrderIds.toString().includes(column._id.toString()))
            throw new Error('Creating New Comlumn Error - Column Not Found In Requied Board');

        // Create the new CARD
        const createdCardResult = await GET_DB()
            .collection(CARD_COLLECTION_NAME)
            .insertOne(validatedRequest.data, { session });
        if (!createdCardResult.acknowledged) {
            throw new Error('Failed to insert new card into database');
        }
        // Update the Column
        await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .updateOne(
                { _id: new ObjectId(createCardRequest.columnId) },
                {
                    $push: {
                        cardOrderIds: createdCardResult.insertedId.toString(),
                        cards: { ...validatedRequest.data, _id: createdCardResult.insertedId },
                    },
                },
                { session },
            );
        await session.commitTransaction();
        return createdCardResult;
    } catch (error) {
        await session.abortTransaction();
        throw new Error('Create New Card Failed');
    } finally {
        session.endSession();
    }
};

const deleteCard = async (cardId: ObjectId, columnId: ObjectId, boardId: ObjectId) => {
    const db = GET_DB();
    const session = await START_SESSION();
    let operationResult = { success: false, message: '' };
    try {
        const board = await db.collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(boardId) });
        if (!board) throw new Error('Delete Card Failed - Board Not Found');

        const column = await db.collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(columnId) });
        if (!column) throw new Error('Delete Card Failed - Column Not Found');

        if (!column.cardOrderIds.toString().includes(cardId))
            throw new Error('Delete Card Failed - Card Not Found In Required Column');

        session.startTransaction();

        const deleteCardResult = await db.collection(CARD_COLLECTION_NAME).deleteOne({ _id: new ObjectId(cardId) });
        await db.collection(COLUMN_COLLECTION_NAME).updateOne(
            {
                _id: new ObjectId(columnId),
            },
            {
                $pull: { cardOrderIds: cardId, cards: { _id: cardId } },
            },
            { session },
        );

        if (deleteCardResult.deletedCount === 0) throw new Error('Delete Card Failed');
        operationResult = {
            success: true,
            message: 'Card deleted successfully',
        };
        await session.commitTransaction();

        return operationResult;
    } catch (error) {
        await session.abortTransaction();
        throw new Error('Delete Card Failed');
    } finally {
        await session.endSession();
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
