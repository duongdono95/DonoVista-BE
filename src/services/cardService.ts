import { ObjectId } from 'mongodb';
import { columnModel } from '../models/columnModel';
import { CardSchemaZod } from '../zod/generalTypes';
import { cardModel } from '../models/cardModel';
import { z } from "zod";

const createNew = async (validatedRequest: z.infer<typeof CardSchemaZod>) => {
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

const updateCard = async (cardId: string, updateCard: z.infer<typeof CardSchemaZod>) => {
    try {
        const result = await cardModel.updateCard(new ObjectId(cardId), updateCard);
        return result;
    } catch (error) {
        throw error;
    }
}


export const cardService = {
    createNew,
    deleteCard,
    updateCard,
};
