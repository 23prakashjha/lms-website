import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, BookOpen, ArrowLeft, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/auth/forgot-password', { email })
      setSent(true)
      toast.success('Password reset link sent to your email')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="max-w-md w-full relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">PrakashEdu</span>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-500 mb-6">We've sent a password reset link to <strong className="text-gray-700">{email}</strong></p>
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Reset Password</h1>
              <p className="text-gray-500 text-center mb-8">Enter your email and we'll send you a password reset link</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                        className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 transition-colors bg-white" />
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3.5 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200 hover:shadow-xl">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-gray-500">
                Remember your password?{' '}
                <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                  <Sparkles className="h-4 w-4 text-primary-500" />
                  <span>Secure reset powered by PrakashEdu</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
