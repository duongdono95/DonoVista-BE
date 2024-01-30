import {Request, Response, NextFunction } from "express"

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req)
  } catch (error) {
    next(error)
  }
}


export const columnController = {
  createNew
}