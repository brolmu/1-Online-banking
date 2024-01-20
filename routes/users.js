import { Router } from 'express'
import { UserController } from '../controllers/controllers.js'
import { auth } from '../middlewares/middlewares.js'

const router = Router()

router.use(auth.validateToken)
router.get('/', UserController.getAll)
router.get('/:id', UserController.getById)
router.use(auth.adminRoleValidation) // Only admin can access the following routes
router.post('/', UserController.create)
router.patch('/:id', UserController.update)
router.delete('/:id', UserController.delete)

export default router
