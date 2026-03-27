import express from 'express'
import {
  createAssignment,
  getCourseAssignments,
  getAssignment,
  submitAssignment,
  gradeSubmission,
  deleteAssignment
} from '../controllers/assignmentController.js'
import { protect, instructorOnly } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, instructorOnly, createAssignment)
router.get('/course/:courseId', getCourseAssignments)
router.get('/:id', getAssignment)
router.post('/:id/submit', protect, submitAssignment)
router.put('/:id/submissions/:submissionId/grade', protect, instructorOnly, gradeSubmission)
router.delete('/:id', protect, instructorOnly, deleteAssignment)

export default router
