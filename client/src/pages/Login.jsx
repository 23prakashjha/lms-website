import { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, BookOpen, Sparkles, Github, ChromeIcon as Google, GraduationCap, Target, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthContext from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const data = await login(email, password)
      const userRole = data.user.role
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else if (userRole === 'instructor') {
        navigate('/instructor/dashboard', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
      toast.success('Login successful!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-300 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mb-8 ring-1 ring-white/20">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">PrakashEdu</h1>
          <h2 className="text-2xl font-bold text-white/90 mb-4">Welcome Back</h2>
          <p className="text-lg text-primary-200/80 mb-10">Sign in to continue your learning journey</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: GraduationCap, label: 'Expert Courses', desc: '200+ courses' },
              { icon: Target, label: 'Learn & Grow', desc: 'At your pace' },
              { icon: BarChart3, label: 'Track Progress', desc: 'Certificates' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 ring-1 ring-white/10">
                <item.icon className="h-6 w-6 text-accent-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-primary-200/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full">
          <div className="text-center lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4 group">
              <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-3 rounded-2xl group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">PrakashEdu</span>
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-1 text-gray-500">Sign in to continue your learning journey</p>
          </div>

          <div className="bg-white rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-100 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-0 transition-colors bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-100 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-0 transition-colors bg-white"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-lg peer-checked:bg-gradient-to-r peer-checked:from-primary-600 peer-checked:to-accent-600 peer-checked:border-transparent transition-all group-hover:border-primary-300" />
                    <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3.5 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group">
                  <Google className="h-5 w-5 mr-2 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button className="flex items-center justify-center px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group">
                  <Github className="h-5 w-5 mr-2 text-gray-800" />
                  <span className="text-sm font-medium text-gray-700">GitHub</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
                  Create one now
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Sparkles className="h-4 w-4 text-primary-500" />
                <span>Secure login powered by PrakashEdu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login