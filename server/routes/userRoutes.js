import express from 'express'
import { getMe, updateProfile, changePassword, getAllUsers, updateUser, deleteUser, getInstructors } from '../controllers/userController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.get('/me', protect, getMe)
router.put('/profile', protect, updateProfile)
router.put('/password', protect, changePassword)
router.get('/', protect, getAllUsers)
router.get('/instructors', protect, getInstructors)
router.put('/:id', protect, updateUser)
router.delete('/:id', protect, adminOnly, deleteUser)

export default router
