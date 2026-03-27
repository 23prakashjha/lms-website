import User from '../models/User.js'

export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('notifications')
    
    res.json({ success: true, notifications: user.notifications })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const markAsRead = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $set: { 'notifications.$[].isRead': true }
    })
    
    res.json({ success: true, message: 'Notifications marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteNotification = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { notifications: { _id: req.params.id } }
    })
    
    res.json({ success: true, message: 'Notification deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const sendNotification = async (userId, type, message) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $push: {
        notifications: { type, message, createdAt: new Date() }
      }
    })
  } catch (error) {
    console.error('Notification error:', error)
  }
}
