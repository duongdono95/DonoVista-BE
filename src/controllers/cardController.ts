import {Request, Response, NextFunction } from "express"
import { NewCardRequestZod, NewColumnRequestZod } from "../zod/generalTypes"
import { columnService } from "../services/columnService"
import { cardService } from "../services/cardService"

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validateRequest = await NewCardRequestZod.safeParseAsync(req.body)
    if(!validateRequest.success){
      throw new Error('Validate Create New Column Request Failed')
    }
    const createdCard = await cardService.createNew(validateRequest.data)
    res.status(200).json({
      code: 200,
      message: 'Created New Card Successfully',
      data: createdCard
    })
  } catch (error) {
    next(error)
  }
}


export const cardController = {
  createNew,

}