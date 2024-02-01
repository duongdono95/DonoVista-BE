import { ObjectId } from "mongodb";
import { columnModel } from "../models/columnModel";
import { NewColumnRequestType } from "../zod/generalTypes";

const createNew = async (validatedRequest: NewColumnRequestType) => {
  try {
      const result = await columnModel.createNew(validatedRequest);
      console.log('result service', result)
      return result;
  } catch (error) {
      throw error;
  }
};
const deleteColumnById = async (columnId: string, boardId: string) => {
  try {
    const result = await columnModel.deleteColumnById(new ObjectId(columnId), new ObjectId(boardId));
    return result
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  deleteColumnById
};