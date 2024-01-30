import {Request, Response, NextFunction } from "express"
import { NewColumnRequestZod } from "../zod/generalTypes"
import { columnService } from "../services/columnService"

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req)
    const validateRequest = await NewColumnRequestZod.safeParseAsync(req.body)
    if(!validateRequest.success){
      throw new Error('Validate Create New Column Request Failed')
    }
    const createdColumn = await columnService.createNew(validateRequest.data)
    console.log(createdColumn)
    res.status(200).json({
      code: 200,
      message: 'Created New Column Successfully',
      data: createdColumn
    })
  } catch (error) {
    next(error)
  }
}



export const columnController = {
  createNew
}