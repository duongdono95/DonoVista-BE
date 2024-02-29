import { Request, Response, NextFunction } from 'express';
import { CardInterface } from '../zod/generalTypes';
import { cardModel } from '../3.Models/cardModel';
import { ColumnInterface } from '../zod/generalTypes';

const createNew = async (card: CardInterface) => {
    try {
        const result = await cardModel.createNew(card);
        return result;
    } catch (error) {
        throw error;
    }
};

const editCard = async (card: CardInterface) => {
    try {
        const result = await cardModel.editCard(card);
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteCard = async (cardId: string) => {
    try {
        const result = await cardModel.deleteCard(cardId);
        return result;
    } catch (error) {
        throw error;
    }
};

const moveCard = async (originalColumn: ColumnInterface, movedColumn: ColumnInterface, activeCard: CardInterface) => {
    try {
        const result = await cardModel.moveCard(originalColumn, movedColumn, activeCard);
        return result;
    } catch (error) {
        throw error;
    }
};

export const cardService = {
    createNew,
    deleteCard,
    editCard,
    moveCard,
};
