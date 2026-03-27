import express from 'express'
import { createLesson, getLesson, updateLesson, deleteLesson, reorderLessons } from '../controllers/lessonController.js'
import { protect, instructorOnly } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, instructorOnly, createLesson)
router.get('/:id', getLesson)
router.put('/:id', protect, instructorOnly, updateLesson)
router.delete('/:id', protect, instructorOnly, deleteLesson)
router.put('/reorder', protect, instructorOnly, reorderLessons)

export default router
