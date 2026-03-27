import Chat from '../models/Chat.js'
import User from '../models/User.js'

export const getOrCreateChat = async (req, res) => {
  try {
    const { participantId, courseId } = req.body

    if (!participantId) {
      return res.status(400).json({ message: 'Participant ID is required' })
    }

    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] },
      course: courseId || null
    })

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user.id, participantId],
        course: courseId
      })
    }

    await chat.populate('participants', 'name avatar email role')
    await chat.populate('course', 'title')

    res.json({ success: true, chat })
  } catch (error) {
    console.error('getOrCreateChat error:', error)
    res.status(500).json({ message: error.message })
  }
}

export const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate('participants', 'name avatar email role')
      .populate('course', 'title')
      .sort({ updatedAt: -1 })

    res.json({ success: true, chats })
  } catch (error) {
    console.error('getMyChats error:', error)
    res.status(500).json({ message: error.message })
  }
}

export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name avatar email role')
      .populate('messages.sender', 'name avatar')
      .populate('course', 'title')

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    const isParticipant = chat.participants.some(
      p => p._id.toString() === req.user.id
    )

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view this chat' })
    }

    res.json({ success: true, chat })
  } catch (error) {
    console.error('getChat error:', error)
    res.status(500).json({ message: error.message })
  }
}

export const sendMessage = async (req, res) => {
  console.log('sendMessage called:', { params: req.params, body: req.body, userId: req.user?.id })
  
  try {
    const { content, attachments } = req.body

    console.log('Chat ID:', req.params.id)
    console.log('Content:', content)
    console.log('Attachments:', attachments)

    if (!content && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ message: 'Message content or attachment is required' })
    }

    const chat = await Chat.findById(req.params.id)
    console.log('Chat found:', chat ? 'yes' : 'no')

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    const isParticipant = chat.participants.some(
      p => p.toString() === req.user.id
    )

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to send message in this chat' })
    }

    const newMessage = {
      sender: req.user.id,
      content: content || '',
      attachments: attachments || [],
      createdAt: new Date()
    }

    console.log('Adding message to chat...')
    chat.messages.push(newMessage)
    chat.lastMessage = {
      content: content || (attachments && attachments.length > 0 ? 'Sent a file' : ''),
      sender: req.user.id,
      createdAt: new Date()
    }

    await chat.save()
    console.log('Chat saved successfully')
    
    await chat.populate('messages.sender', 'name avatar')
    await chat.populate('course', 'title')

    const savedMessage = chat.messages[chat.messages.length - 1]
    console.log('Message saved:', savedMessage)

    res.json({ success: true, message: savedMessage })
  } catch (error) {
    console.error('Send message error:', error)
    res.status(500).json({ message: error.message })
  }
}

export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    const isParticipant = chat.participants.some(
      p => p.toString() === req.user.id
    )

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to delete this chat' })
    }

    await Chat.findByIdAndDelete(req.params.id)

    res.json({ success: true, message: 'Chat deleted' })
  } catch (error) {
    console.error('deleteChat error:', error)
    res.status(500).json({ message: error.message })
  }
}

export const markAsRead = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== req.user.id) {
        msg.read = true
      }
    })

    await chat.save()

    res.json({ success: true })
  } catch (error) {
    console.error('markAsRead error:', error)
    res.status(500).json({ message: error.message })
  }
}
