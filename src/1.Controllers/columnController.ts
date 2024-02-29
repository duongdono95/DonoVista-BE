import { Request, Response, NextFunction } from 'express';
import { ColumnSchema } from '../zod/generalTypes';
import { columnService } from '../2.Services/columnService';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedCol = ColumnSchema.safeParse(req.body);
        if (!validatedCol.success) throw new Error('Validate Column failed');

        const result = await columnService.createNew(validatedCol.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Create Column Success',
        });
    } catch (error) {
        next(error);
    }
};

const editColumn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedCol = ColumnSchema.safeParse(req.body);
        if (!validatedCol.success) throw new Error('Validate Column failed');

        const result = await columnService.editColumn(validatedCol.data);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Update Column Success',
        });
    } catch (error) {
        next(error);
    }
};
const deleteColumn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const colId = req.params.id;

        const result = await columnService.deleteColumn(colId);
        res.status(200).json({
            data: result,
            code: 200,
            message: 'Delete Column Success',
        });
    } catch (error) {
        next(error);
    }
};

export const columnController = {
    createNew,
    editColumn,
    deleteColumn,
};
