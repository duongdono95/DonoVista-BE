import { Request, Response, NextFunction } from 'express';
import { CardSchemaZodWithID, ColumnSchemaZodWithId } from '../zod/generalTypes';
import { columnService } from '../services/columnService';
import { cardService } from '../services/cardService';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validateRequest = await CardSchemaZodWithID.omit({ _id: true }).safeParseAsync(req.body);
        if (!validateRequest.success) {
            throw new Error('Validate Create New Card Request Failed');
        }
        const createdCard = await cardService.createNew(validateRequest.data);
        if (!createdCard) throw new Error('Create New Card Failed');
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
        if (!result) throw new Error('Delete Card Failed');
        res.status(200).json({
            code: 200,
            message: 'Delete New Card Successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const updateCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) throw new Error('Update Card Request missing required Id');
        const validateRequest = await CardSchemaZodWithID.safeParseAsync(req.body);
        if (!validateRequest.success) throw new Error('Validate Update Card Request Failed');
        const result = await cardService.updateCard(req.params.id, validateRequest.data);
        if (!result) throw new Error('Update Card Failed');
        res.status(200).json({
            code: 200,
            message: 'Update Card Successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const cardController = {
    createNew,
    deleteCard,
    updateCard,
};
