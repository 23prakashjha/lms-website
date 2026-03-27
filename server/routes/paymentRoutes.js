import express from 'express'
import { createOrder, verifyPayment, getMyPayments, getAllPayments } from '../controllers/paymentController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.post('/create-order', protect, createOrder)
router.post('/verify', protect, verifyPayment)
router.get('/my-payments', protect, getMyPayments)
router.get('/all', protect, adminOnly, getAllPayments)

export default router
