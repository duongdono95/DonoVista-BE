import { Request, Response, NextFunction } from 'express';
import { NewCardRequestZod, NewColumnRequestZod } from '../zod/generalTypes';
import { columnService } from '../services/columnService';
import { cardService } from '../services/cardService';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validateRequest = await NewCardRequestZod.safeParseAsync(req.body);
        if (!validateRequest.success) {
            throw new Error('Validate Create New Column Request Failed');
        }
        const createdCard = await cardService.createNew(validateRequest.data);
        res.status(200).json({
            code: 200,
            message: 'Created New Card Successfully',
            data: createdCard,
        });
    } catch (error) {
        next(error);
    }
};
const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cardId = req.body.cardId;
        const columnId = req.body.columnId;
        const boardId = req.body.boardId;
        if (!cardId || !boardId || !columnId) throw new Error('Delete Card Request missing required fields');
        const result = await cardService.deleteCard(cardId, columnId, boardId);
        res.status(200).json({
            code: 200,
            message: 'Delete New Card Successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const cardController = {
    createNew,
    deleteCard,
};
