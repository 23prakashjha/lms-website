import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const chatDir = path.join(__dirname, '../uploads/chat')
const avatarDir = path.join(__dirname, '../uploads/avatars')
const thumbnailDir = path.join(__dirname, '../uploads/thumbnails')

if (!fs.existsSync(chatDir)) {
  fs.mkdirSync(chatDir, { recursive: true })
}
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true })
}
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true })
}

const chatStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, chatDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `chat-${uniqueSuffix}${ext}`)
  }
})

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `avatar-${uniqueSuffix}${ext}`)
  }
})

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false)
  }
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed'
  ]
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false)
  }
}

const chatUpload = multer({
  storage: chatStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
})

const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, thumbnailDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `thumbnail-${uniqueSuffix}${ext}`)
  }
})

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})

const thumbnailUpload = multer({
  storage: thumbnailStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})

export const uploadChatFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const protocol = req.protocol
    const host = req.get('host')
    const baseUrl = `${protocol}://${host}`
    const fileUrl = `${baseUrl}/uploads/chat/${req.file.filename}`

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export const uploadAvatar = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const protocol = req.protocol
    const host = req.get('host')
    const baseUrl = `${protocol}://${host}`
    const fileUrl = `${baseUrl}/uploads/avatars/${req.file.filename}`

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export const uploadThumbnail = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const protocol = req.protocol
    const host = req.get('host')
    const baseUrl = `${protocol}://${host}`
    const fileUrl = `${baseUrl}/uploads/thumbnails/${req.file.filename}`

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    })
  } catch (error) {
    console.error('Thumbnail upload error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export const uploadMiddleware = chatUpload.single('file')

export const uploadMultipleMiddleware = chatUpload.array('files', 5)

export const uploadAvatarMiddleware = avatarUpload.single('avatar')

export const uploadThumbnailMiddleware = thumbnailUpload.single('thumbnail')
