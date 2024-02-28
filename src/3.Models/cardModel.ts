import { ObjectId } from 'mongodb';
import { GET_DB } from '../config/mongodb';
import { UserInterface, userSchema } from "../zod/generalTypes";

export const CARD_COLLECTION_NAME = 'cards';
export const INVALID_UPDATED_FIELDS = ['_id', 'createdAt'];

const createNew = async (req: UserInterface) => {
    try {
      return ''
    } catch (error) {
        throw error;
    }
};

export const cardModel = {
    createNew,
};