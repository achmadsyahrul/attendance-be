import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { body } from 'express-validator'
import fs from 'fs'
import moment from 'moment-timezone'
import multer from 'multer'
import path from 'path'

const prisma = new PrismaClient()

const uploadDir = 'storage'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage }).single('photo')

export const markAttendance = [
  upload,
  body('latitude').notEmpty().withMessage('Latitude is required'),
  body('longitude').notEmpty().withMessage('Longitude is required'),
  body('status').notEmpty().withMessage('Status is required'),

  async (req: Request, res: Response): Promise<void> => {
    const { latitude, longitude, location, status } = req.body
    const userId = req.userId
    const ip = req.ip

    if (!req.file) {
      res.status(400).json({ message: 'Photo is required' })
      return
    }

    try {
      const attendance = await prisma.attendance.create({
        data: {
          userId,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          location,
          ip,
          photoUrl: req.file.path,
          status,
          date: new Date(),
        },
      })

      res.status(200).json({
        message: 'Attendance marked successfully',
        attendance,
      })
    } catch (error) {
      console.error('Error marking attendance:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
]

export const reportAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const timezone = req.query.timezone as string
    const startDate = req.query.startDate as string
    const endDate = req.query.endDate as string
    const userId = req.userId

    if (!userId || !startDate || !endDate || !timezone) {
      res.status(400).json({ message: 'Missing required query parameters' })
      return
    }

    const start = moment(startDate).startOf('day').toDate()
    const end = moment(endDate).endOf('day').toDate()

    const attendanceData = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    })

    const attendanceWithTimezone = attendanceData.map((attendance) => {
      const localTimestamp = moment(attendance.date).tz(timezone).format('YYYY-MM-DD HH:mm:ss')
      return { ...attendance, timestamp: localTimestamp }
    })

    res.json({ attendance: attendanceWithTimezone })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error retrieving attendance data' })
  }
}
