import { columnModel } from "../models/columnModel";
import { NewColumnRequestType } from "../zod/generalTypes";

const createNew = async (validatedRequest: NewColumnRequestType) => {
  try {
      const result = await columnModel.createNew(validatedRequest);
      return result;
  } catch (error) {
      throw error;
  }
};

export const columnService = {
  createNew,
};