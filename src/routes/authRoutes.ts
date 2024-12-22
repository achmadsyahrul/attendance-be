import { Router } from 'express'
import { login, logout, register } from '../controllers/authController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router: Router = Router()

router.post('/login', login)

router.post('/register', register)

router.post('/logout', authMiddleware, logout)

export default router
