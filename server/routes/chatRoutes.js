import express from 'express'
import { 
  getOrCreateChat, 
  getMyChats, 
  getChat, 
  sendMessage,
  deleteChat,
  markAsRead
} from '../controllers/chatController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, getOrCreateChat)
router.get('/', protect, getMyChats)
router.get('/:id', protect, getChat)
router.post('/:id/messages', protect, sendMessage)
router.delete('/:id', protect, deleteChat)
router.put('/:id/read', protect, markAsRead)

export default router
