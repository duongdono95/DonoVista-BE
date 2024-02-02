import { ObjectId } from "mongodb";
import { columnModel } from "../models/columnModel";
import { NewCardRequestType } from "../zod/generalTypes";
import { cardModel } from "../models/cardModel";

const createNew = async (validatedRequest: NewCardRequestType) => {
  try {
      const result = await cardModel.createNew(validatedRequest);
      return result;
  } catch (error) {
      throw error;
  }
};


export const cardService = {
  createNew,
};