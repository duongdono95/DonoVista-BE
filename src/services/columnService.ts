import { ObjectId } from 'mongodb';
import { columnModel } from '../models/columnModel';
import {  ColumnSchemaZod, ColumnSchemaZodWithId } from "../zod/generalTypes";
import { z } from "zod";


const createNew = async (validatedRequest: z.infer<typeof ColumnSchemaZod>) => {
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

const updateColumnById = async (id: string, validatedRequest: z.infer<typeof ColumnSchemaZod>) => {
    try {
        const result = await columnModel.updateColumnById(new ObjectId(id), validatedRequest);
        return result;
    } catch (error) {
        throw error;
    }
};

const updateColumnInBulk = async (originalColumn: z.infer<typeof ColumnSchemaZodWithId>, overColumn: z.infer<typeof ColumnSchemaZodWithId> ) => {
    try {
        const result = await columnModel.updateColumnInBulk(originalColumn, overColumn);
        return result;
    } catch (error) {
        throw error;
    }
}

export const columnService = {
    createNew,
    deleteColumnById,
    updateColumnById,
    updateColumnInBulk
};
