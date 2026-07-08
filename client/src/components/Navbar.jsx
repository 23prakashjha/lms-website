import { useState, useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, BookOpen, Settings, LayoutDashboard, Shield, Info, Phone, Award, FileText, HelpCircle, MessageCircle, Bell, ChevronDown, GraduationCap, Bot, Code2, GitBranch, Sparkles, Search, Sun, Moon, ChevronRight, ExternalLink } from 'lucide-react'
import AuthContext from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userDropdownOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserDropdownOpen(false)
    setIsOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-br from-primary-500 to-accent-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-200">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">PrakashEdu</span>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {[
                { to: '/courses', label: 'Courses', icon: BookOpen },
                { to: '/instructor', label: 'Instructors', icon: GraduationCap },
                { to: '/coding-practice', label: 'Practice', icon: Code2 },
                { to: '/projects', label: 'Projects', icon: GitBranch },
                { to: '/about', label: 'About', icon: Info },
                { to: '/contact', label: 'Contact', icon: Phone },
              ].map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl transition-all duration-200"
                >
                  <Icon className="h-4 w-4 mr-1.5" />
                  {label}
                </Link>
              ))}
              <a
                href="https://mern-job-portal-beryl-one.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 rounded-xl transition-all duration-200"
              >
                <ExternalLink className="h-4 w-4 mr-1.5" />
                HireNext
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
            >
              <Search className="h-5 w-5" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full ring-2 ring-primary-100" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-primary-100">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900 leading-tight">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize leading-tight">{user.role}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-fade-down overflow-y-auto max-h-[calc(100vh-5rem)]">
                      <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-accent-50 mx-3 rounded-xl mb-1">
                        <div className="flex items-center space-x-3">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full ring-2 ring-white" />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-lg font-bold ring-2 ring-white">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="mt-2 inline-flex items-center px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full capitalize">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {user.role}
                        </div>
                      </div>

                      <div className="px-3 py-1">
                        <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</p>
                        <Link
                          to={user.role === 'instructor' ? '/instructor/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                          className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all group"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4 mr-3" />
                          Dashboard
                          <ChevronRight className="h-3.5 w-3.5 ml-auto text-gray-300 group-hover:text-primary-500 transition-all group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all group"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          My Profile
                          <ChevronRight className="h-3.5 w-3.5 ml-auto text-gray-300 group-hover:text-primary-500 transition-all group-hover:translate-x-0.5" />
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 mx-3" />
                      <div className="px-3 py-1">
                        <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Learning</p>
                        <Link to="/ai-assistant" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all" onClick={() => setUserDropdownOpen(false)}>
                          <Bot className="h-4 w-4 mr-3" />AI Assistant
                        </Link>
                        <Link to="/coding-practice" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all" onClick={() => setUserDropdownOpen(false)}>
                          <Code2 className="h-4 w-4 mr-3" />Coding Practice
                        </Link>
                        <Link to="/projects" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all" onClick={() => setUserDropdownOpen(false)}>
                          <GitBranch className="h-4 w-4 mr-3" />Projects
                        </Link>
                        <Link to="/certificates" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all" onClick={() => setUserDropdownOpen(false)}>
                          <Award className="h-4 w-4 mr-3" />Certificates
                        </Link>
                        <Link to="/assignments" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all" onClick={() => setUserDropdownOpen(false)}>
                          <FileText className="h-4 w-4 mr-3" />Assignments
                        </Link>
                        <Link to="/quizzes" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all" onClick={() => setUserDropdownOpen(false)}>
                          <HelpCircle className="h-4 w-4 mr-3" />Quizzes
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 mx-3" />
                      <div className="px-3 py-1">
                        <Link to="/notifications" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all" onClick={() => setUserDropdownOpen(false)}>
                          <Bell className="h-4 w-4 mr-3" />Notifications
                        </Link>
                        <Link to="/chat" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all" onClick={() => setUserDropdownOpen(false)}>
                          <MessageCircle className="h-4 w-4 mr-3" />Messages
                        </Link>
                        {user.role === 'instructor' && (
                          <Link to="/instructor/create-course" className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all" onClick={() => setUserDropdownOpen(false)}>
                            <BookOpen className="h-4 w-4 mr-3" />Create Course
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-100 mx-3 pt-1 pb-0">
                        <button onClick={handleLogout} className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-0.5">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {user ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-1.5 rounded-xl hover:bg-gray-100 transition-all"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>
            ) : (
              <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed inset-x-0 top-0 h-screen bg-white/95 backdrop-blur-xl z-50 transform transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
            <div className="bg-gradient-to-br from-primary-500 to-accent-600 p-2 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PrakashEdu</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-600 hover:text-primary-600 rounded-xl hover:bg-gray-100">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-20">
          <div className="px-4 py-6 space-y-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </form>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Navigate</p>
              <div className="space-y-1">
                {[
                  { to: '/courses', label: 'Courses', icon: BookOpen },
                  { to: '/instructor', label: 'Instructors', icon: GraduationCap },
                  { to: '/coding-practice', label: 'Practice', icon: Code2 },
                  { to: '/projects', label: 'Projects', icon: GitBranch },
                  { to: '/about', label: 'About', icon: Info },
                  { to: '/contact', label: 'Contact', icon: Phone },
                ].map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to} className="flex items-center px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all text-sm font-medium" onClick={() => setIsOpen(false)}>
                    <Icon className="h-5 w-5 mr-3" />
                    {label}
                    <ChevronRight className="h-4 w-4 ml-auto text-gray-300" />
                  </Link>
                ))}
                <a
                  href="https://mern-job-portal-beryl-one.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <ExternalLink className="h-5 w-5 mr-3" />
                  HireNext
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-300" />
                </a>
              </div>
            </div>

            {user && (
              <div className="border-t border-gray-100 pt-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">My Account</p>
                <div className="space-y-1">
                  <Link to={user.role === 'instructor' ? '/instructor/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all text-sm font-medium" onClick={() => setIsOpen(false)}>
                    <LayoutDashboard className="h-5 w-5 mr-3" />Dashboard
                  </Link>
                  <Link to="/profile" className="flex items-center px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all text-sm font-medium" onClick={() => setIsOpen(false)}>
                    <User className="h-5 w-5 mr-3" />Profile
                  </Link>
                  <Link to="/ai-assistant" className="flex items-center px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all text-sm font-medium" onClick={() => setIsOpen(false)}>
                    <Bot className="h-5 w-5 mr-3" />AI Assistant
                  </Link>
                  <Link to="/certificates" className="flex items-center px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all text-sm font-medium" onClick={() => setIsOpen(false)}>
                    <Award className="h-5 w-5 mr-3" />Certificates
                  </Link>
                  <Link to="/assignments" className="flex items-center px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all text-sm font-medium" onClick={() => setIsOpen(false)}>
                    <FileText className="h-5 w-5 mr-3" />Assignments
                  </Link>
                  <Link to="/chat" className="flex items-center px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all text-sm font-medium" onClick={() => setIsOpen(false)}>
                    <MessageCircle className="h-5 w-5 mr-3" />Messages
                  </Link>
                  <Link to="/notifications" className="flex items-center px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all text-sm font-medium" onClick={() => setIsOpen(false)}>
                    <Bell className="h-5 w-5 mr-3" />Notifications
                  </Link>
                  {user.role === 'instructor' && (
                    <Link to="/instructor/create-course" className="flex items-center px-3 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all text-sm font-medium" onClick={() => setIsOpen(false)}>
                      <BookOpen className="h-5 w-5 mr-3" />Create Course
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-medium">
                    <LogOut className="h-5 w-5 mr-3" />Logout
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <div className="border-t border-gray-100 pt-6 px-3 space-y-3">
                <Link to="/register" className="block w-full text-center bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3.5 rounded-2xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg" onClick={() => setIsOpen(false)}>
                  Get Started Free
                </Link>
                <Link to="/login" className="block w-full text-center py-3.5 rounded-2xl font-semibold text-gray-700 hover:bg-gray-100 transition-all border border-gray-200" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="hidden md:block absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg animate-fade-down">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses, topics, or instructors..."
                className="w-full pl-12 pr-20 py-4 bg-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all text-lg"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-700 transition-all text-sm">
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
