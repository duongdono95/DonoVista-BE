import { ObjectId } from 'mongodb';
import { columnModel } from '../models/columnModel';
import { ColumnSchemaType, NewColumnRequestType } from '../zod/generalTypes';

const createNew = async (validatedRequest: NewColumnRequestType) => {
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

const updateColumnById = (id: string, validatedRequest: ColumnSchemaType) => {
    try {
        const result = columnModel.updateColumnById(new ObjectId(id), validatedRequest);
        return result;
    } catch (error) {
        throw error;
    }
};

export const columnService = {
    createNew,
    deleteColumnById,
    updateColumnById,
};
