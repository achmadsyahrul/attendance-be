import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export const getFile = async (req: Request, res: Response): Promise<void> => {
  const { filename } = req.params
  const filePath = path.join(__dirname, '../../storage', filename)

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: 'File not found' })
    return
  }
  res.sendFile(filePath)
}
