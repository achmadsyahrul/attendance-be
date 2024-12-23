import { Router } from 'express'

import { markAttendance, reportAttendance } from '../controllers/attendanceController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router: Router = Router()

router.post('/mark', authMiddleware, markAttendance)
router.get('/report', authMiddleware, reportAttendance)

export default router
