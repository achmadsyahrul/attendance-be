import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import redisClient from '../services/redisClient'

const prisma = new PrismaClient()

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' })
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    })

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, config.app.jwtSecret, { expiresIn: '1h' })
    await redisClient.set(token, user.id.toString(), { EX: 3600 })

    const { password: except, ...data } = user
    res.status(200).json({ message: 'Login successful', user: data, token })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const register = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      })

      await prisma.profile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
        },
      })

      res.status(201).json({
        message: 'User registered successfully',
        user: { id: user.id, firstName, lastName, email },
      })
    } catch (error) {
      console.error('Error registering user:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
]

export const logout = async (req: Request, res: Response) => {
  if (req.token) {
    await redisClient.del(req.token)
  }
  res.status(200).json({ message: 'Logout successful' })
}
