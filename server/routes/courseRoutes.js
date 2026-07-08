import express from 'express'
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getCategories,
  addReview,
  getMyReview,
  getMyReviews,
  updateReview,
  deleteReview
} from '../controllers/courseController.js'
import { protect, authorize, instructorOnly } from '../middleware/auth.js'

const router = express.Router()

// Static routes first
router.get('/categories', getCategories)
router.get('/', getCourses)
router.get('/my-courses', protect, instructorOnly, getInstructorCourses)

// Review routes (must be before /:slug to avoid conflict)
router.get('/reviews/my-reviews', protect, getMyReviews)
router.get('/:id/reviews/mine', protect, getMyReview)
router.post('/:id/reviews', protect, addReview)
router.put('/:id/reviews/:reviewId', protect, updateReview)
router.delete('/:id/reviews/:reviewId', protect, deleteReview)

// Course CRUD
router.get('/:slug', getCourse)
router.post('/', protect, instructorOnly, createCourse)
router.put('/:id', protect, instructorOnly, updateCourse)
router.delete('/:id', protect, instructorOnly, deleteCourse)

export default router
