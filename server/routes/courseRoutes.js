import express from 'express'
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getCategories,
  addReview
} from '../controllers/courseController.js'
import { protect, authorize, instructorOnly } from '../middleware/auth.js'

const router = express.Router()

router.get('/categories', getCategories)
router.get('/', getCourses)
router.get('/my-courses', protect, instructorOnly, getInstructorCourses)
router.get('/:slug', getCourse)
router.post('/', protect, instructorOnly, createCourse)
router.put('/:id', protect, instructorOnly, updateCourse)
router.delete('/:id', protect, instructorOnly, deleteCourse)
router.post('/:id/reviews', protect, addReview)

export default router
