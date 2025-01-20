import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { parseBearer } from '../utils/parseBearer'

declare module 'express-serve-static-core' {
  interface Request {
    userId: string
    token: string
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const token = await parseBearer(req.headers.authorization)

  try {
    const { userId } = jwt.verify(token, config.app.jwtSecret) as { userId: string }

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    req.userId = userId
    req.token = token

    next()
  } catch (error) {
    console.error('Error verifying token:', error)
    res.status(401).json({ message: 'Unauthorized' })
  }
}
