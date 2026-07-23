import { useState, useEffect, useContext, useRef } from 'react'
import { Send, MessageCircle, User, Plus, X, Search, Phone, Video, MoreVertical, Circle, Image, FileText, Download, Eye, File, Paperclip, Smile, Check, CheckCheck, Trash2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AuthContext from '../context/AuthContext'

const Chat = () => {
  const { user } = useContext(AuthContext)
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showNewChat, setShowNewChat] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  useEffect(() => {
    fetchChats()
    fetchUsers()
    initSocket()
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id)
    }
  }, [selectedChat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initSocket = async () => {
    try {
      const { io } = await import('socket.io-client')
      const socket = io('https://lms-website-f9ha.onrender.com', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })
      
      socketRef.current = socket

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id)
        setSocketConnected(true)
        if (user?._id) {
          socket.emit('addUser', user._id)
        }
      })

      socket.on('disconnect', () => {
        setSocketConnected(false)
      })

      socket.on('getMessage', (data) => {
        if (selectedChat && data.chatId === selectedChat._id) {
          setMessages(prev => [...prev, {
            _id: Date.now(),
            sender: data.senderId,
            content: data.message,
            attachments: data.attachments || [],
            createdAt: data.createdAt || new Date()
          }])
        }
        
        if (data.senderId && data.chatId) {
          setChats(prev => prev.map(chat => {
            if (chat._id === data.chatId) {
              return {
                ...chat,
                lastMessage: {
                  content: data.message || 'Sent a file',
                  sender: data.senderId,
                  createdAt: new Date()
                }
              }
            }
            return chat
          }))
        }
      })

      socket.on('newChat', (data) => {
        setChats(prev => [data.chat, ...prev])
        setSelectedChat(data.chat)
        setShowNewChat(false)
      })

    } catch (error) {
      console.error('Socket initialization error:', error)
    }
  }

  const fetchChats = async () => {
    try {
      const { data } = await axios.get('/api/chats')
      setChats(data.chats || [])
    } catch (error) {
      console.error('Error fetching chats:', error)
      setChats([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users')
      const filteredUsers = (data.users || []).filter(u => u._id !== user?._id)
      setUsers(filteredUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchMessages = async (chatId) => {
    try {
      const { data } = await axios.get(`/api/chats/${chatId}`)
      setMessages(data.chat?.messages || [])
      
      if (socketRef.current && socketConnected) {
        socketRef.current.emit('joinChat', chatId)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    }
  }

  const searchUsers = async (query) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    
    const filtered = users.filter(u => 
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
    )
    setSearchResults(filtered)
  }

  const startNewChat = async (selectedUser) => {
    try {
      const { data } = await axios.post('/api/chats', {
        participantId: selectedUser._id
      })
      
      const newChat = data.chat
      
      if (socketRef.current && socketConnected) {
        socketRef.current.emit('newChat', {
          chat: newChat,
          recipientId: selectedUser._id
        })
      }
      
      setChats(prev => [newChat, ...prev])
      setSelectedChat(newChat)
      setShowNewChat(false)
      setSearchQuery('')
      setSearchResults([])
      toast.success(`Chat started with ${selectedUser.name}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start chat')
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const maxSize = 10 * 1024 * 1024
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 10MB`)
        return false
      }
      return true
    })

    setSelectedFiles(prev => [...prev, ...validFiles])
    e.target.value = ''
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const { data } = await axios.post('/api/upload/chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      console.log('Upload success:', data)
      return data
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(`Failed to upload ${file.name}`)
      return null
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() && selectedFiles.length === 0) {
      toast.error('Please enter a message or attach a file')
      return
    }
    if (!selectedChat) {
      toast.error('Please select a chat first')
      return
    }

    setUploading(true)
    const attachments = []

    try {
      for (const file of selectedFiles) {
        const uploaded = await uploadFile(file)
        if (uploaded && uploaded.success) {
          attachments.push({
            filename: file.name,
            url: uploaded.url,
            type: file.type,
            size: file.size
          })
        }
      }

      console.log('Sending message:', { content: newMessage, attachments })
      
      const { data } = await axios.post(`/api/chats/${selectedChat._id}/messages`, {
        content: newMessage,
        attachments
      })
      
      console.log('Message sent response:', data)

      setMessages(prev => [...prev, data.message])

      if (socketRef.current && socketConnected) {
        const otherParticipant = selectedChat.participants.find(p => p._id !== user._id)
        socketRef.current.emit('sendMessage', {
          chatId: selectedChat._id,
          senderId: user._id,
          receiverId: otherParticipant?._id,
          message: newMessage,
          attachments,
          createdAt: new Date()
        })
      }

      setChats(prev => prev.map(chat => {
        if (chat._id === selectedChat._id) {
          return {
            ...chat,
            lastMessage: {
              content: newMessage || 'Sent a file',
              sender: user._id,
              createdAt: new Date()
            }
          }
        }
        return chat
      }))

      setNewMessage('')
      setSelectedFiles([])
      toast.success('Message sent')

    } catch (error) {
      console.error('Error sending message:', error)
      console.error('Error response:', error.response?.data)
      toast.error(error.response?.data?.message || 'Failed to send message')
    } finally {
      setUploading(false)
    }
  }

  const deleteChatHandler = async (chatId, e) => {
    e.stopPropagation()
    if (!confirm('Delete this conversation? This action cannot be undone.')) return
    try {
      await axios.delete(`/api/chats/${chatId}`)
      setChats(prev => prev.filter(c => c._id !== chatId))
      if (selectedChat?._id === chatId) {
        setSelectedChat(null)
        setMessages([])
      }
      toast.success('Conversation deleted')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete conversation')
    }
  }

  const getOtherParticipant = (chat) => {
    return chat.participants?.find(p => p._id !== user?._id)
  }

  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (d.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return Image
    if (type?.includes('pdf')) return FileText
    if (type?.includes('word') || type?.includes('document')) return FileText
    return File
  }

  const isImage = (type) => {
    return type?.startsWith('image/')
  }

  const getFileType = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase()
    const types = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
      zip: 'application/zip',
      rar: 'application/x-rar-compressed'
    }
    return types[ext] || 'application/octet-stream'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="h-7 w-7 mr-2 text-primary-600" />
            Messages
          </h1>
          <button
            onClick={() => setShowNewChat(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Message
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
          <div className="flex h-full">
            <div className="w-80 border-r flex flex-col">
              <div className="p-3 border-b bg-gradient-to-r from-primary-50 to-accent-50">
                <div className="flex items-center mb-3">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover border-2 border-primary-200" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-200">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                  )}
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="input-field pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 text-sm">No conversations yet</p>
                    <p className="text-gray-400 text-xs mt-1">Click "New Message" to start chatting</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {chats
                      .filter(chat => {
                        const other = getOtherParticipant(chat)
                        if (!searchQuery) return true
                        return other?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                      })
                      .map((chat) => {
                        const other = getOtherParticipant(chat)
                        const isSelected = selectedChat?._id === chat._id
                        const lastMsg = chat.lastMessage
                        const isOwn = lastMsg?.sender === user?._id
                        
                        return (
                          <div key={chat._id} className="group relative">
                            <button
                              onClick={() => setSelectedChat(chat)}
                              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                                isSelected ? 'bg-primary-50' : ''
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="relative">
                                  {other?.avatar ? (
                                    <img src={other.avatar} alt={other.name} className="h-12 w-12 rounded-full object-cover" />
                                  ) : (
                                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                                      <User className="h-6 w-6 text-primary-600" />
                                    </div>
                                  )}
                                  <Circle className="h-3 w-3 text-green-500 absolute bottom-0 right-0 bg-white rounded-full" />
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="font-semibold text-gray-900 truncate">
                                      {other?.name || 'Unknown User'}
                                    </p>
                                    {lastMsg && (
                                      <span className="text-xs text-gray-400">
                                        {formatTime(lastMsg.createdAt)}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 truncate mt-0.5">
                                    {isOwn && lastMsg ? <span className="text-gray-400">You: </span> : null}
                                    {lastMsg?.content || 'No messages yet'}
                                  </p>
                                </div>
                              </div>
                            </button>
                            <button
                              onClick={(e) => deleteChatHandler(chat._id, e)}
                              className="absolute top-1/2 -translate-y-1/2 right-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                              title="Delete conversation"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  <div className="p-4 border-b bg-white flex items-center justify-between">
                    <div className="flex items-center">
                      {getOtherParticipant(selectedChat)?.avatar ? (
                        <img 
                          src={getOtherParticipant(selectedChat).avatar} 
                          alt={getOtherParticipant(selectedChat).name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                      )}
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">
                          {getOtherParticipant(selectedChat)?.name}
                        </h3>
                        <p className="text-xs text-gray-500 capitalize">
                          {getOtherParticipant(selectedChat)?.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center ml-4 text-xs px-2 py-1 rounded-full ${
                        socketConnected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Circle className={`h-2 w-2 mr-1 ${socketConnected ? 'text-green-500' : 'text-gray-400'}`} />
                        {socketConnected ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500">No messages yet</p>
                          <p className="text-gray-400 text-sm">Send a message to start the conversation</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const isOwn = msg.sender === user?._id || msg.sender?._id === user?._id
                        const showDate = index === 0 || formatDate(messages[index - 1]?.createdAt) !== formatDate(msg.createdAt)
                        
                        return (
                          <div key={msg._id || index}>
                            {showDate && (
                              <div className="text-center my-4">
                                <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                                  {formatDate(msg.createdAt)}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                                isOwn
                                  ? 'bg-primary-600 text-white rounded-br-md'
                                  : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                              }`}>
                                {msg.content && <p className="text-sm mb-2">{msg.content}</p>}
                                
                                {msg.attachments?.length > 0 && (
                                  <div className="space-y-2">
                                    {msg.attachments.map((file, fileIndex) => {
                                      const FileIcon = getFileIcon(file.type)
                                      const isImg = isImage(file.type)
                                      
                                      return (
                                        <div 
                                          key={fileIndex}
                                          className={`rounded-lg overflow-hidden ${
                                            isOwn ? 'bg-primary-700' : 'bg-gray-100'
                                          }`}
                                        >
                                          {isImg ? (
                                            <div 
                                              className="cursor-pointer relative group"
                                              onClick={() => setShowPreview(file)}
                                            >
                                              <img 
                                                src={file.url} 
                                                alt={file.filename}
                                                className="max-h-64 object-contain"
                                              />
                                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100" />
                                              </div>
                                            </div>
                                          ) : (
                                            <a 
                                              href={file.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className={`flex items-center p-3 ${
                                                isOwn ? 'hover:bg-primary-800' : 'hover:bg-gray-200'
                                              } transition-colors`}
                                            >
                                              <FileIcon className={`h-8 w-8 mr-3 ${isOwn ? 'text-white' : 'text-gray-600'}`} />
                                              <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium truncate ${isOwn ? 'text-white' : 'text-gray-900'}`}>
                                                  {file.filename}
                                                </p>
                                                <p className={`text-xs ${isOwn ? 'text-primary-200' : 'text-gray-500'}`}>
                                                  {formatFileSize(file.size)}
                                                </p>
                                              </div>
                                              <Download className={`h-5 w-5 ml-2 ${isOwn ? 'text-white' : 'text-gray-600'}`} />
                                            </a>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                                
                                <p className={`text-xs mt-2 ${isOwn ? 'text-primary-200' : 'text-gray-400'}`}>
                                  {formatTime(msg.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="p-3 bg-gray-100 border-t">
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => {
                          const isImg = file.type.startsWith('image/')
                          return (
                            <div 
                              key={index}
                              className="relative bg-white rounded-lg p-2 flex items-center"
                            >
                              {isImg ? (
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={file.name}
                                  className="h-12 w-12 object-cover rounded"
                                />
                              ) : (
                                <FileText className="h-8 w-8 text-gray-400" />
                              )}
                              <button
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={sendMessage} className="p-4 bg-white border-t">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="input-field flex-1"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <button 
                        type="submit" 
                        disabled={(!newMessage.trim() && selectedFiles.length === 0) || uploading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Supports: Images, PDF, Word, Excel, PowerPoint, Text files (Max 10MB)
                    </p>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
                    <p className="text-gray-500 mt-1">Choose from your existing conversations or start a new one</p>
                    <button
                      onClick={() => setShowNewChat(true)}
                      className="btn-primary mt-4"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      New Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">New Message</h2>
              <button
                onClick={() => {
                  setShowNewChat(false)
                  setSearchQuery('')
                  setSearchResults([])
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input-field pl-10"
                  value={searchQuery}
                  onChange={(e) => searchUsers(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {(searchResults.length > 0 ? searchResults : users.slice(0, 10)).map((u) => (
                  <button
                    key={u._id}
                    onClick={() => startNewChat(u)}
                    className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                    )}
                    <div className="ml-3 text-left">
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{u.role}</p>
                    </div>
                  </button>
                ))}
                
                {users.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No users found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setShowPreview(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-8 w-8" />
          </button>
          <img 
            src={showPreview.url} 
            alt={showPreview.filename}
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-4 py-2 flex items-center space-x-4">
            <a 
              href={showPreview.url}
              download={showPreview.filename}
              className="flex items-center text-gray-700 hover:text-primary-600"
            >
              <Download className="h-5 w-5 mr-2" />
              Download
            </a>
            <span className="text-gray-500 text-sm">{showPreview.filename}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
