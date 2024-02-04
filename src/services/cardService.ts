import { ObjectId } from 'mongodb';
import { columnModel } from '../models/columnModel';
import { NewCardRequestType } from '../zod/generalTypes';
import { cardModel } from '../models/cardModel';

const createNew = async (validatedRequest: NewCardRequestType) => {
    try {
        const result = await cardModel.createNew(validatedRequest);
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteCard = async (cardId: string, columnId: string, boardId: string) => {
    try {
        const result = await cardModel.deleteCard(new ObjectId(cardId), new ObjectId(columnId), new ObjectId(boardId));
        return result;
    } catch (error) {
        throw error;
    }
};

export const cardService = {
    createNew,
    deleteCard,
};
