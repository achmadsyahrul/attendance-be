import { Router } from 'express'
import { getFile } from '../controllers/storageController'

const router = Router()

// Route for serving uploaded files
router.get('/file/:filename', getFile)

export default router
