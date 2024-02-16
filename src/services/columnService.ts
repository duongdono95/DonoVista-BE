import { ObjectId } from 'mongodb';
import { columnModel } from '../models/columnModel';
import { BoardSchemaZodWithId, CardSchemaZodWithID, ColumnSchemaZodWithId } from '../zod/generalTypes';
import { z } from 'zod';

const createNew = async (validatedRequest: Omit<z.infer<typeof ColumnSchemaZodWithId>, '_id'>) => {
    try {
        const result = await columnModel.createNew(validatedRequest);
        return result;
    } catch (error) {
        throw error;
    }
};
const deleteColumnById = async (columnId: string, boardId: string) => {
    try {
        const result = await columnModel.deleteColumnById(new ObjectId(columnId), new ObjectId(boardId));
        return result;
    } catch (error) {
        throw error;
    }
};

const updateColumnById = async (id: string, validatedRequest: z.infer<typeof ColumnSchemaZodWithId>) => {
    try {
        const result = await columnModel.updateColumnById(new ObjectId(id), validatedRequest);
        return result;
    } catch (error) {
        throw error;
    }
};

const arrangeCards = async (
    startColumn: z.infer<typeof ColumnSchemaZodWithId>,
    endColumn: z.infer<typeof ColumnSchemaZodWithId>,
    activeCard: z.infer<typeof CardSchemaZodWithID>,
) => {
    try {
        const result = await columnModel.arrangeCards(startColumn, endColumn, activeCard);
        return result;
    } catch (error) {
        throw error;
    }
};

const duplicateColumn = async (validatedColumn: z.infer<typeof ColumnSchemaZodWithId>, validatedBoard: z.infer<typeof BoardSchemaZodWithId>) => {
    try {
        const result = await columnModel.duplicateColumn(validatedColumn, validatedBoard);
        return result;
    } catch (error) {
        throw error;
    }
};

export const columnService = {
    createNew,
    deleteColumnById,
    updateColumnById,
    arrangeCards,
    duplicateColumn,
};
