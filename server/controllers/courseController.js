import Course from '../models/Course.js'
import Lesson from '../models/Lesson.js'
import Review from '../models/Review.js'
import User from '../models/User.js'

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user.id,
      isPublished: true
    })
    
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdCourses: course._id }
    })

    res.status(201).json({ success: true, course })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCourses = async (req, res) => {
  try {
    const { search, category, level, price, sort, page = 1, limit = 12 } = req.query
    
    const query = {}
    
    if (search) {
      query.$text = { $search: search }
    }
    if (category) {
      query.category = category
    }
    if (level) {
      query.level = level
    }
    if (price === 'free') {
      query.price = 0
    } else if (price === 'paid') {
      query.price = { $gt: 0 }
    }

    let sortOption = { totalStudents: -1 }
    if (sort === 'newest') sortOption = { createdAt: -1 }
    if (sort === 'rating') sortOption = { averageRating: -1 }
    if (sort === 'price-low') sortOption = { price: 1 }
    if (sort === 'price-high') sortOption = { price: -1 }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    const total = await Course.countDocuments(query)

    res.json({
      success: true,
      courses,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('instructor', 'name avatar email bio')
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 })
    const reviews = await Review.find({ course: course._id, isApproved: true })
      .populate('user', 'name avatar')

    res.json({ success: true, course, lessons, reviews })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateCourse = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, instructor: req.user.id }

    const course = await Course.findOneAndUpdate(filter, req.body, { new: true, runValidators: true })

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    res.json({ success: true, course })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteCourse = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, instructor: req.user.id }

    const course = await Course.findOneAndDelete(filter)
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    res.json({ success: true, message: 'Course deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
    res.json({ success: true, courses })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCategories = async (req, res) => {
  try {
    const categories = await Course.distinct('category', { isPublished: true })
    res.json({ success: true, categories })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      course: course._id
    })

    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this course' })
    }

    const review = await Review.create({
      user: req.user.id,
      course: course._id,
      rating,
      comment
    })

    const reviews = await Review.find({ course: course._id, isApproved: true })
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

    course.averageRating = avgRating
    course.totalRatings = reviews.length
    await course.save()

    res.status(201).json({ success: true, review })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
