import express from 'express'
import { createQuiz, getCourseQuizzes, getQuiz, attemptQuiz, deleteQuiz } from '../controllers/quizController.js'
import { protect, instructorOnly } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, instructorOnly, createQuiz)
router.get('/course/:courseId', getCourseQuizzes)
router.get('/:id', getQuiz)
router.post('/:id/attempt', protect, attemptQuiz)
router.delete('/:id', protect, instructorOnly, deleteQuiz)

export default router
