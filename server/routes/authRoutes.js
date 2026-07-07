import express from 'express'
import { register, login, forgotPassword, resetPassword, adminRegister } from '../controllers/authController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/admin/register', protect, adminOnly, adminRegister)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password/:token', resetPassword)

export default router
