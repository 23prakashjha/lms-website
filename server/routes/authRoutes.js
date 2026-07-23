import express from 'express'
import passport from 'passport'
import { register, login, forgotPassword, resetPassword, adminRegister, handleOAuthCallback } from '../controllers/authController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/admin/register', protect, adminOnly, adminRegister)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password/:token', resetPassword)

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }))
  router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login` }), handleOAuthCallback)
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  router.get('/github', passport.authenticate('github', { session: false, scope: ['user:email'] }))
  router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login` }), handleOAuthCallback)
}

export default router
