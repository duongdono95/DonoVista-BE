import { Request, Response, NextFunction } from 'express';
import { CardSchema } from '../zod/generalTypes';
import { cardService } from '../2.Services/cardSerivce';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const card = req.body;
        if (!card) throw new Error('Missing required fields');
        const validatedCard = CardSchema.safeParse(card);
        if (!validatedCard.success) throw new Error('Validate Column failed');

        const result = await cardService.createNew(validatedCard.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Column Success',
        });
    } catch (error) {
        next(error);
    }
};
const editCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const card = req.body;
        if (!card) throw new Error('Missing required fields');
        const validatedCard = CardSchema.safeParse(card);
        if (!validatedCard.success) throw new Error('Validate Column failed');

        const result = await cardService.editCard(validatedCard.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Column Success',
        });
    } catch (error) {
        next(error);
    }
};

const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cardId = req.params.id;
        if (!cardId) throw new Error('Missing required fields');

        const result = await cardService.deleteCard(cardId);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Column Success',
        });
    } catch (error) {
        next(error);
    }
};

const moveCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const originalColumn = req.body.originalColumn;
        const movedColumn = req.body.movedColumn;
        const activeCard = req.body.activeCard;
        if (!originalColumn || !movedColumn || !activeCard) throw new Error('Missing required fields');

        const result = await cardService.moveCard(originalColumn, movedColumn, activeCard);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Column Success',
        });
    } catch (error) {
        next(error);
    }
};

export const cardController = {
    createNew,
    deleteCard,
    editCard,
    moveCard,
};
