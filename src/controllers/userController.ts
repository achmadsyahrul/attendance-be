import { PrismaClient, Profile, User } from '@prisma/client'
import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

const prisma = new PrismaClient()

export const update = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional(),
  body('address').optional(),
  body('photoUrl').optional(),
  body('email').optional().isEmail().withMessage('Valid email is required'),

  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { firstName, lastName, phone, address, photoUrl, email } = req.body
    const userId = req.userId

    try {
      const profileData: Partial<Profile> = { firstName, lastName, phone, address, photoUrl }
      const userData: Partial<User> = { email }

      if (email) {
        userData.email = email
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: userData,
      })

      const { password, ...userResponse } = updatedUser

      const updatedProfile = await prisma.profile.update({
        where: { userId },
        data: profileData,
      })

      res.status(200).json({
        message: 'Profile updated successfully',
        user: userResponse,
        profile: updatedProfile,
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
]

export const info = async (req: Request, res: Response) => {
  const userId = req.userId

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  })

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  const { password, ...data } = user

  res.status(200).json({ data, message: 'success' })
}
