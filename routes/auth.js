import { Router } from 'express'
import { AuthController } from '../controllers/controllers.js'

const router = Router()

router.post('/', AuthController.generateToken)
router.post('/validate', AuthController.validateToken)

export default router
