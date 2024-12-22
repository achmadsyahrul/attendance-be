import { Router } from 'express'
import { info, update } from '../controllers/userController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router: Router = Router()

router.get('/info', authMiddleware, info)

router.put('/update', authMiddleware, update)

export default router
