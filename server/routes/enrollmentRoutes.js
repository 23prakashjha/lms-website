import express from 'express'
import {
  enrollInCourse,
  freeEnroll,
  getMyEnrollments,
  getEnrollment,
  checkEnrollment,
  markLessonComplete,
  getAllEnrollments
} from '../controllers/enrollmentController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.post('/enroll', protect, enrollInCourse)
router.post('/free-enroll', protect, freeEnroll)
router.get('/my-enrollments', protect, getMyEnrollments)
router.get('/all', protect, adminOnly, getAllEnrollments)
router.get('/course/:courseId', protect, getEnrollment)
router.get('/check/:courseId', protect, checkEnrollment)
router.put('/course/:courseId/lesson-complete', protect, markLessonComplete)

export default router
