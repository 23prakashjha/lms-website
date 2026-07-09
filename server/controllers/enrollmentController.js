import Enrollment from '../models/Enrollment.js'
import Course from '../models/Course.js'
import Certificate from '../models/Certificate.js'
import User from '../models/User.js'

export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    })

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' })
    }

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId
    })

    course.totalStudents += 1
    await course.save()

    await User.findByIdAndUpdate(req.user.id, {
      $push: { enrolledCourses: courseId }
    })

    res.status(201).json({ success: true, enrollment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const freeEnroll = async (req, res) => {
  try {
    const { courseId } = req.body

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    })

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' })
    }

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId
    })

    course.totalStudents += 1
    await course.save()

    await User.findByIdAndUpdate(req.user.id, {
      $push: { enrolledCourses: courseId }
    })

    res.status(201).json({ success: true, enrollment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('course', 'title slug thumbnail totalDuration instructor lessons')
      .populate('course.instructor', 'name avatar')
      .sort({ enrolledAt: -1 })

    res.json({ success: true, enrollments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: req.params.courseId
    }).populate('course')

    res.json({ success: true, enrollment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: req.params.courseId
    })

    res.json({ success: true, isEnrolled: !!enrollment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'name email')
      .populate('course', 'title')
      .sort({ enrolledAt: -1 })
    res.json({ success: true, enrollments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.body
    const { courseId } = req.params

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId
    }).populate('course')

    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' })
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId)
      const totalLessons = enrollment.course?.lessons?.length || 1
      enrollment.progress = Math.round(
        (enrollment.completedLessons.length / totalLessons) * 100
      )

      if (enrollment.progress >= 100) {
        enrollment.isCompleted = true
        
        const course = await Course.findById(courseId).populate('instructor', 'name')
        const certificate = await Certificate.create({
          user: req.user.id,
          course: courseId,
          enrollment: enrollment._id,
          studentName: req.user.name,
          courseName: course.title,
          instructorName: course.instructor?.name || 'Instructor',
          completionDate: new Date()
        })

        enrollment.certificateId = certificate._id
      }

      await enrollment.save()
    }

    res.json({ success: true, enrollment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
