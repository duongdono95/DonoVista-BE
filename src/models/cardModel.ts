import { ObjectId } from "mongodb";
import { GET_DB, START_SESSION } from "../config/mongodb";
import { CardSchemaZod, NewCardRequestType } from "../zod/generalTypes";
import { BOARD_COLLECTION_NAME } from "./boardModel";
import { COLUMN_COLLECTION_NAME } from "./columnModel";

const CARD_COLLECTION_NAME = 'cards';
const createNew = async (createCardRequest: NewCardRequestType ) => {
  const validatedRequest = CardSchemaZod.safeParse(createCardRequest);
  if (!validatedRequest.success) {
      throw new Error('Validate Add New Column To Database Failed');
  }
  const session =await START_SESSION();
  try {
    session.startTransaction();
      // validate the board
      const board = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
        _id: new ObjectId(validatedRequest.data.boardId)
      })
      if(!board) throw new Error('Creating New Comlumn Error - Board Not Found')

      // Validate the columnId
      const column = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(validatedRequest.data.columnId)}, { session });
      if(!column) throw new Error('Creating New Comlumn Error - Column Not Found In Requied Board')
      if(!board.columnOrderIds.toString().includes(column._id.toString())) throw new Error('Creating New Comlumn Error - Column Not Found In Requied Board')

      // Create the new CARD
      const createdCardResult = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(validatedRequest.data, { session });
      if (!createdCardResult.acknowledged) {
          throw new Error('Failed to insert new card into database');
      }
      // Update the Column
      await GET_DB().collection(COLUMN_COLLECTION_NAME).updateOne(
        { _id: new ObjectId(createCardRequest.columnId) },
        { $push: { cardOrderIds: createdCardResult.insertedId , cards: {...validatedRequest.data, _id: createdCardResult.insertedId}} },
        { session }
    );
    await session.commitTransaction();
    return createdCardResult;
  } catch (error) {
    await session.abortTransaction();
      throw new Error('Create New Card Failed');
  } finally {
    session.endSession();
}
};


export const cardModel = {
  createNew,
  CARD_COLLECTION_NAME
};
