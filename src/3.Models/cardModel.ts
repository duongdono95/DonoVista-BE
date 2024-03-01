import { ObjectId } from 'mongodb';
import { GET_DB } from '../config/mongodb';
import {
    CardInterface,
    CardSchema,
    ColumnInterface,
    ColumnSchema,
    UserInterface,
    userSchema,
} from '../zod/generalTypes';
import { COLUMN_COLLECTION_NAME, columnModel } from './columnModel';
import { boardModel } from './boardModel';

export const CARD_COLLECTION_NAME = 'cards';
export const INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];

const createNew = async (card: CardInterface) => {
    try {
        const validatedCol = CardSchema.omit({ _id: true }).safeParse(card);
        if (!validatedCol.success) throw new Error('Invalid Column');
        const col = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(validatedCol.data);
        if (!col.insertedId) throw new Error('Create New Column Failed!');
        const updateColumn = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .updateOne(
                { id: card.columnId },
                {
                    $push: {
                        cards: { _id: col.insertedId, ...card },
                        cardOrderIds: card.id,
                    },
                },
            );
        if (updateColumn.modifiedCount === 0) throw new Error('Update Board Failed!');
        const updateBoard = boardModel.updateBoardColumns(card.boardId);

        return { ...card, _id: col.insertedId };
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const editCard = async (card: CardInterface) => {
    try {
        const validatedCard = CardSchema.omit({ _id: true }).safeParse(card);
        if (!validatedCard.success) throw new Error('Invalid Column');
        const updatedCard = await GET_DB()
            .collection(CARD_COLLECTION_NAME)
            .updateOne(
                { id: card.id },
                {
                    $set: {
                        ...validatedCard.data,
                        updatedAt: new Date().toString(),
                    },
                },
            );
        if (updatedCard.modifiedCount === 0) throw new Error('Create New Column Failed!');
        await columnModel.updateColumnCards(card.columnId);
        await boardModel.updateBoardColumns(card.boardId);
        return updatedCard;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
const deleteCard = async (cardId: string) => {
    try {
        const card = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ id: cardId });
        if (!card) throw new Error('Card not found!');
        const deleteCard = await GET_DB().collection(CARD_COLLECTION_NAME).deleteOne({ id: cardId });
        const updateColumn = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .updateOne(
                {
                    id: card.columnId,
                },
                {
                    $pull: {
                        cards: { id: cardId },
                        cardOrderIds: cardId,
                    },
                },
            );
        if (updateColumn.modifiedCount === 0) throw new Error('Delete Card Failed!');
        await boardModel.updateBoardColumns(card.boardId);
        return updateColumn;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const moveCard = async (originalColumn: ColumnInterface, movedColumn: ColumnInterface, activeCard: CardInterface) => {
    try {
        const valicatedOriginalColumn = ColumnSchema.omit({ _id: true, createdAt: true }).safeParse(originalColumn);
        const valicatedMovedColumn = ColumnSchema.omit({ _id: true, createdAt: true }).safeParse(movedColumn);
        const validatedActiveCard = CardSchema.omit({ _id: true, createdAt: true }).safeParse(activeCard);
        if (!valicatedOriginalColumn.success || !validatedActiveCard.success || !valicatedMovedColumn.success)
            throw new Error('Validation failed');
        if (valicatedOriginalColumn.data.id !== valicatedMovedColumn.data.id) {
            const updateOriginalCol = await GET_DB()
                .collection(COLUMN_COLLECTION_NAME)
                .updateOne(
                    { id: valicatedOriginalColumn.data.id },
                    { $set: { ...valicatedOriginalColumn.data, updatedAt: new Date().toString() } },
                );
            const updateCard = await GET_DB()
                .collection(CARD_COLLECTION_NAME)
                .updateOne(
                    { id: validatedActiveCard.data.id },
                    { $set: { ...validatedActiveCard.data, updatedAt: new Date().toString() } },
                );
            if (updateCard.modifiedCount === 0 || updateOriginalCol.modifiedCount === 0)
                throw new Error('Move Card failed');
        }
        const updateMovedCol = await GET_DB()
            .collection(COLUMN_COLLECTION_NAME)
            .updateOne(
                { id: valicatedMovedColumn.data.id },
                { $set: { ...valicatedMovedColumn.data, updatedAt: new Date().toString() } },
            );

        if (updateMovedCol.modifiedCount === 0) throw new Error('Move Card failed');
        await boardModel.updateBoardColumns(activeCard.boardId);
        return 'Move Card successfully';
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const cardModel = {
    createNew,
    deleteCard,
    editCard,
    moveCard,
};
