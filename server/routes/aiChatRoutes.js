import express from 'express'
import { chatWithAI, chatWithAIContext } from '../controllers/aiChatController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, chatWithAI)
router.post('/context', protect, chatWithAIContext)

export default router
