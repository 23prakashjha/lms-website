import Lesson from '../models/Lesson.js'
import Course from '../models/Course.js'

export const createLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.body.course)
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const lesson = await Lesson.create({
      ...req.body,
      instructor: course.instructor
    })

    course.lessons.push(lesson._id)
    await course.save()

    res.status(201).json({ success: true, lesson })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course', 'title slug instructor')
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    res.json({ success: true, lesson })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    if (lesson.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({ success: true, lesson: updatedLesson })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
    
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    if (lesson.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await Course.findByIdAndUpdate(lesson.course, {
      $pull: { lessons: lesson._id }
    })

    await Lesson.findByIdAndDelete(req.params.id)

    res.json({ success: true, message: 'Lesson deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const reorderLessons = async (req, res) => {
  try {
    const { lessons } = req.body

    await Promise.all(
      lessons.map((item, index) =>
        Lesson.findByIdAndUpdate(item.lessonId, { order: index })
      )
    )

    res.json({ success: true, message: 'Lessons reordered' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
