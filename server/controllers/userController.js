import User from '../models/User.js'

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json({ success: true, user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, avatar, highestQualification, subjects, languages, currentCompany, totalExperience, experience } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, skills, avatar, highestQualification, subjects, languages, currentCompany, totalExperience, experience },
      { new: true, runValidators: true }
    )
    res.json({ success: true, user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id).select('+password')

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json({ success: true, users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).select('-password')
    res.json({ success: true, users: instructors })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, role, isVerified } = req.body
    
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, role, isVerified },
      { new: true, runValidators: true }
    )
    
    res.json({ success: true, user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    res.json({ success: true, message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
