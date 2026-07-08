import Assignment from '../models/Assignment.js'
import Enrollment from '../models/Enrollment.js'

export const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create({
      ...req.body,
      instructor: req.user.id
    })
    res.status(201).json({ success: true, assignment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('instructor', 'name avatar')
    res.json({ success: true, assignments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('instructor', 'name avatar')
      .populate('submissions.student', 'name avatar')
    res.json({ success: true, assignment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyAssignments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id }).select('course')
    const courseIds = enrollments.map(e => e.course)
    console.log('[getMyAssignments] userId:', req.user.id, 'enrollments:', enrollments.length, 'courseIds:', courseIds)
    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate('course', 'title thumbnail slug')
      .populate('instructor', 'name')
    console.log('[getMyAssignments] assignments found:', assignments.length)
    const result = assignments.map(a => {
      const submission = a.submissions.find(s => s.student?.toString() === req.user.id)
      return {
        _id: a._id,
        title: a.title,
        description: a.description,
        course: a.course,
        instructor: a.instructor,
        maxScore: a.maxScore,
        deadline: a.deadline,
        instructions: a.instructions,
        submittedAt: submission?.submittedAt || null,
        grade: submission?.grade || null,
        isGraded: submission?.isGraded || false,
        isSubmitted: !!submission
      }
    })
    res.json({ success: true, assignments: result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
    
    const existingSubmission = assignment.submissions.find(
      s => s.student.toString() === req.user.id
    )

    if (existingSubmission) {
      existingSubmission.files = req.body.files
      existingSubmission.submittedAt = new Date()
    } else {
      assignment.submissions.push({
        student: req.user.id,
        files: req.body.files
      })
    }

    await assignment.save()
    res.json({ success: true, assignment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params
    const { grade, feedback } = req.body

    const assignment = await Assignment.findById(req.params.id)

    const submission = assignment.submissions.id(submissionId)
    submission.grade = grade
    submission.feedback = feedback
    submission.isGraded = true

    await assignment.save()
    res.json({ success: true, assignment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Assignment deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
