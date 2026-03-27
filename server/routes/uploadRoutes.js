import express from 'express'
import { uploadChatFile, uploadMiddleware } from '../controllers/uploadController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/chat', protect, (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Maximum size is 10MB' })
      }
      if (err.message && err.message.includes('File type')) {
        return res.status(400).json({ success: false, message: err.message })
      }
      return res.status(400).json({ success: false, message: err.message || 'File upload failed' })
    }
    next()
  })
}, uploadChatFile)

export default router
