import { Request, Response, NextFunction } from 'express';
import { ColumnSchemaZod, ColumnSchemaZodWithId } from '../zod/generalTypes';
import { columnService } from '../services/columnService';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validateRequest = await ColumnSchemaZod.safeParseAsync(req.body);
        if (!validateRequest.success) {
            throw new Error('Validate Create New Column Request Failed');
        }
        const createdColumn = await columnService.createNew(validateRequest.data);
        res.status(200).json({
            code: 200,
            message: 'Created New Column Successfully',
            data: createdColumn,
        });
    } catch (error) {
        next(error);
    }
};

const deleteColumnById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletionResult = await columnService.deleteColumnById(req.body.columnId, req.body.boardId);
        res.status(200).json({
            code: 200,
            message: 'Deleted Column Successfully',
            data: deletionResult,
        });
    } catch (error) {
        next(error);
    }
};

export const updateColumnById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validateRequest = await ColumnSchemaZod.safeParseAsync(req.body);

        if (!validateRequest.success) throw new Error('Validate Update Column Request Failed');
        const result = await columnService.updateColumnById(req.params.id, validateRequest.data);
        if (!result) throw new Error('Update Column Failed');
        res.status(200).json({
            code: 200,
            message: 'Updated Column Successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const updateColumnInBulk = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
        if(!req.body) throw new Error('Update Card In Bulk Request missing required fields');
        const validatedRequest =  {
            originalColumn: await ColumnSchemaZodWithId.safeParseAsync(req.body.originalColumn),
            overColumn: await ColumnSchemaZodWithId.safeParseAsync(req.body.overColumn),
        }
        if(!validatedRequest.originalColumn.success || !validatedRequest.overColumn.success) throw new Error('Validate Update Card In Bulk Request Failed')
        console.log(validatedRequest.originalColumn.data, validatedRequest.overColumn.data)
        const result = await columnService.updateColumnInBulk(validatedRequest.originalColumn.data, validatedRequest.overColumn.data);
        if(!result) throw new Error('Update Card In Bulk Failed');
        res.status(200).json({
            code: 200,
            message: 'Update Card In Bulk Successfully',
            data: result,
        })
    } catch (error) {
        next(error);
    }
}

export const columnController = {
    createNew,
    deleteColumnById,
    updateColumnById,
    updateColumnInBulk
};
