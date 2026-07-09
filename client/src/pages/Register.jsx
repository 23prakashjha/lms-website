import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, BookOpen, GraduationCap, School, Shield, Sparkles, Github, ChromeIcon as Google, Target, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthContext from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'student'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const { name, email, password, confirmPassword, role } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRoleChange = (newRole) => {
    setFormData({ ...formData, role: newRole })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields'); return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match'); return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters'); return
    }

    setLoading(true)
    try {
      const data = await register({ name, email, password, role })
      toast.success('Registration successful!')
      if (data.user.role === 'instructor') navigate('/instructor/dashboard')
      else if (data.user.role === 'admin') navigate('/admin/dashboard')
      else navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: 'student', label: 'Student', icon: GraduationCap },
    { value: 'instructor', label: 'Instructor', icon: School },
    { value: 'admin', label: 'Admin', icon: Shield },
  ]

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
          <h2 className="text-2xl font-bold text-white/90 mb-4">Start Your Journey</h2>
          <p className="text-lg text-primary-200/80 mb-10">Create an account and unlock endless learning possibilities</p>
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
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-1 text-gray-500">Start your learning journey today</p>
          </div>

          <div className="bg-white rounded-3xl">
            <div className="flex mb-6 bg-gray-100/80 rounded-xl p-1.5">
              {roles.map(({ value, label, icon: Icon }) => (
                <button key={value} type="button" onClick={() => handleRoleChange(value)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    role === value
                      ? 'bg-white text-primary-600 shadow-md'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input type="text" name="name" value={name} onChange={handleChange} placeholder="Enter your name"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-0 transition-colors bg-white" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input type="email" name="email" value={email} onChange={handleChange} placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-0 transition-colors bg-white" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={handleChange} placeholder="Create a password"
                      className="w-full pl-11 pr-12 py-3 border-2 border-gray-100 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-0 transition-colors bg-white" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {password && password.length < 6 && <p className="text-xs text-red-500 mt-1">Minimum 6 characters</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-sm" />
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={confirmPassword} onChange={handleChange} placeholder="Confirm your password"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-xl text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-0 transition-colors bg-white" />
                  </div>
                </div>
                {confirmPassword && (password === confirmPassword ? (
                  <p className="text-xs text-green-500 mt-1 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1" /> Passwords match</p>
                ) : (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                ))}
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3.5 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
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
                <button onClick={() => window.location.href = 'http://localhost:5001/api/auth/google'} className="flex items-center justify-center px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <Google className="h-5 w-5 mr-2 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button onClick={() => window.location.href = 'http://localhost:5001/api/auth/github'} className="flex items-center justify-center px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <Github className="h-5 w-5 mr-2 text-gray-800" />
                  <span className="text-sm font-medium text-gray-700">GitHub</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                  Sign in
                </Link>
              </p>
            </div>

            <p className="mt-4 text-xs text-gray-400 text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a> and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Sparkles className="h-4 w-4 text-primary-500" />
                <span>Join 50,000+ learners on PrakashEdu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register