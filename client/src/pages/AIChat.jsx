import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI learning assistant at PrakashEdu. Ask me anything about courses, programming, technology, or your learning journey!'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const { data } = await axios.post('/api/ai-chat', { message: userMsg })
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      toast.error('Failed to get response. Please try again.')
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI learning assistant at PrakashEdu. Ask me anything about courses, programming, technology, or your learning journey!'
      }
    ])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bot className="h-7 w-7 mr-2 text-primary-600" />
              AI Assistant
            </h1>
            <p className="text-gray-500 text-sm mt-1">Ask me anything about learning at PrakashEdu</p>
          </div>
          <button onClick={handleClear} className="btn-secondary py-2 px-3 text-sm flex items-center">
            <Trash2 className="h-4 w-4 mr-1" />
            Clear Chat
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start max-w-xl ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-primary-100 ml-3' : 'bg-purple-100 mr-3'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4 text-primary-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-gray-100 rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSend} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="input-field flex-1"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-2 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by AI — answers are generated to help with your learning
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChat
