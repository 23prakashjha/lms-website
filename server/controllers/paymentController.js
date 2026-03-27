import Payment from '../models/Payment.js'
import Enrollment from '../models/Enrollment.js'
import Course from '../models/Course.js'
import User from '../models/User.js'

export const createOrder = async (req, res) => {
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

    const Razorpay = (await import('razorpay')).default
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    const amount = (course.discountPrice || course.price) * 100

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        courseId: courseId,
        userId: req.user.id
      }
    })

    const payment = await Payment.create({
      user: req.user.id,
      course: courseId,
      amount: amount / 100,
      razorpayOrderId: order.id,
      status: 'pending'
    })

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      },
      paymentId: payment._id
    })
  } catch (error) {
    console.error('Razorpay error:', error)
    res.status(500).json({ message: error.message })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id })
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    payment.razorpayPaymentId = razorpay_payment_id
    payment.razorpaySignature = razorpay_signature
    payment.status = 'completed'
    await payment.save()

    const enrollment = await Enrollment.create({
      user: payment.user,
      course: payment.course
    })

    await Course.findByIdAndUpdate(payment.course, {
      $inc: { totalStudents: 1 }
    })

    await User.findByIdAndUpdate(payment.user, {
      $push: { enrolledCourses: payment.course }
    })

    res.json({ success: true, enrollment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('course', 'title thumbnail')
      .sort({ createdAt: -1 })

    res.json({ success: true, payments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'completed' })
      .populate('user', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })

    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0)

    res.json({ success: true, payments, totalRevenue })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
