import Certificate from '../models/Certificate.js'
import Enrollment from '../models/Enrollment.js'
import Course from '../models/Course.js'
import User from '../models/User.js'

export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('user', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
    res.json({ success: true, certificates })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user.id })
      .populate('course', 'title')
      .sort({ createdAt: -1 })
    res.json({ success: true, certificates })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createCertificate = async (req, res) => {
  try {
    const { enrollmentId, studentName, courseName, instructorName } = req.body

    if (enrollmentId) {
      const enrollment = await Enrollment.findById(enrollmentId)
        .populate('course')
        .populate('user', 'name email')

      if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' })
      }

      if (enrollment.certificateId) {
        return res.status(400).json({ message: 'Certificate already exists for this enrollment' })
      }

      const course = await Course.findById(enrollment.course._id).populate('instructor', 'name')

      const certificate = await Certificate.create({
        user: enrollment.user._id,
        course: enrollment.course._id,
        enrollment: enrollment._id,
        studentName: enrollment.user.name,
        courseName: course.title,
        instructorName: course.instructor?.name || 'Instructor',
        completionDate: new Date()
      })

      enrollment.certificateId = certificate._id
      enrollment.isCompleted = true
      await enrollment.save()

      return res.status(201).json({ success: true, certificate })
    }

    const certificate = await Certificate.create({
      user: req.body.userId,
      course: req.body.courseId,
      enrollment: req.body.enrollmentId,
      studentName,
      courseName,
      instructorName: instructorName || 'Instructor',
      completionDate: new Date()
    })

    res.status(201).json({ success: true, certificate })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'name email')
      .populate('course', 'title slug thumbnail')

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' })
    }

    res.json({ success: true, certificate })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id)
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' })
    }

    if (certificate.enrollment) {
      await Enrollment.findByIdAndUpdate(certificate.enrollment, {
        $unset: { certificateId: '' }
      })
    }

    res.json({ success: true, message: 'Certificate deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
