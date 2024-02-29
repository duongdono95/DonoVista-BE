import { Request, Response, NextFunction } from 'express';
import { ColumnInterface } from '../zod/generalTypes';
import { columnModel } from '../3.Models/columnModel';

const createNew = async (column: ColumnInterface) => {
    try {
        const result = await columnModel.createNew(column);
        return result;
    } catch (error) {
        throw error;
    }
};

const editColumn = async (column: ColumnInterface) => {
    try {
        const result = await columnModel.editColumn(column);
        return result;
    } catch (error) {
        throw error;
    }
};

const deleteColumn = async (columnId: string) => {
    try {
        const result = await columnModel.deleteColumn(columnId);
        return result;
    } catch (error) {
        throw error;
    }
};

export const columnService = {
    createNew,
    editColumn,
    deleteColumn,
};
