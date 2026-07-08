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
    const certificates = await Certificate.find({
      $or: [
        { user: req.user.id },
        { studentName: req.user.name }
      ]
    })
      .populate('course', 'title')
      .sort({ createdAt: -1 })
    res.json({ success: true, certificates })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createCertificate = async (req, res) => {
  try {
    const {
      enrollmentId, studentName, courseName, instructorName,
      certificateTitle, organizationName, logo,
      studentId, studentPhoto,
      courseLevel, courseDuration, totalHours, technologies,
      grade, percentage, quizScore, projectScore,
      instructorSignature, directorName, directorSignature, officialStamp,
      description, qrCode, verificationUrl, skills,
      accreditation
    } = req.body

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
        instructorName: course.instructor?.name || instructorName || 'Instructor',
        certificateTitle: certificateTitle || 'Certificate of Completion',
        organizationName: organizationName || 'PrakashEdu',
        logo: logo || '',
        studentId: studentId || '',
        studentPhoto: studentPhoto || '',
        courseLevel: courseLevel || course.level || '',
        courseDuration: courseDuration || '',
        totalHours: totalHours || 0,
        technologies: technologies || course.tags || [],
        grade: grade || '',
        percentage: percentage || 0,
        quizScore: quizScore || 0,
        projectScore: projectScore || 0,
        instructorSignature: instructorSignature || '',
        directorName: directorName || '',
        directorSignature: directorSignature || '',
        officialStamp: officialStamp || '',
        description: description || '',
        qrCode: qrCode || '',
        verificationUrl: verificationUrl || '',
        skills: skills || [],
        accreditation: accreditation || { isoCertified: false, industryPartner: '' },
        completionDate: new Date()
      })

      enrollment.certificateId = certificate._id
      enrollment.isCompleted = true
      await enrollment.save()

      return res.status(201).json({ success: true, certificate })
    }

    const certificateData = {
      user: req.body.userId,
      course: req.body.courseId,
      enrollment: req.body.enrollmentId,
      studentName,
      courseName,
      instructorName: instructorName || 'Instructor',
      certificateTitle: certificateTitle || 'Certificate of Completion',
      organizationName: organizationName || 'PrakashEdu',
      logo: logo || '',
      studentId: studentId || '',
      studentPhoto: studentPhoto || '',
      courseLevel: courseLevel || '',
      courseDuration: courseDuration || '',
      totalHours: totalHours || 0,
      technologies: technologies || [],
      grade: grade || '',
      percentage: percentage || 0,
      quizScore: quizScore || 0,
      projectScore: projectScore || 0,
      instructorSignature: instructorSignature || '',
      directorName: directorName || '',
      directorSignature: directorSignature || '',
      officialStamp: officialStamp || '',
      description: description || '',
      qrCode: qrCode || '',
      verificationUrl: verificationUrl || '',
      skills: skills || [],
      accreditation: accreditation || { isoCertified: false, industryPartner: '' },
      completionDate: new Date()
    }

    const certificate = await Certificate.create(certificateData)
    res.status(201).json({ success: true, certificate })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' })
    }
    res.json({ success: true, certificate })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('course', 'title slug thumbnail level tags totalDuration')

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' })
    }

    res.json({ success: true, certificate })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('user', 'name email')
      .populate('course', 'title')

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found', valid: false })
    }

    res.json({
      success: true,
      valid: true,
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        courseName: certificate.courseName,
        issueDate: certificate.issueDate,
        certificateTitle: certificate.certificateTitle,
        organizationName: certificate.organizationName
      }
    })
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
