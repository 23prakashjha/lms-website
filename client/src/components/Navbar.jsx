import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, BookOpen, Settings, LayoutDashboard, Shield, Info, Phone, Award, FileText, HelpCircle, MessageCircle, Bell, ChevronDown } from 'lucide-react'
import AuthContext from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserDropdownOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">LMS Platform</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/courses" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Courses
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Contact
            </Link>
            <Link to="/certificates" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Certificates
            </Link>
            <Link to="/assignments" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Assignments
            </Link>
            <Link to="/quizzes" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Quizzes
            </Link>
            <Link to="/chat" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Messages
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/notifications" className="text-gray-600 hover:text-primary-600 transition-colors">
                  <Bell className="h-6 w-6" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                    <ChevronDown className={`h-4 w-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border">
                      <div className="px-4 py-3 border-b">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded capitalize">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        My Profile
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Bell className="h-4 w-4 mr-3" />
                        Notifications
                      </Link>
                      <Link
                        to="/chat"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <MessageCircle className="h-4 w-4 mr-3" />
                        Messages
                      </Link>
                      {user.role === 'instructor' && (
                        <>
                          <div className="border-t my-2"></div>
                          <Link
                            to="/instructor/dashboard"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4 mr-3" />
                            Instructor Dashboard
                          </Link>
                          <Link
                            to="/instructor/create-course"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <BookOpen className="h-4 w-4 mr-3" />
                            Create Course
                          </Link>
                        </>
                      )}
                      {user.role === 'admin' && (
                        <>
                          <div className="border-t my-2"></div>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Shield className="h-4 w-4 mr-3" />
                            Admin Panel
                          </Link>
                        </>
                      )}
                      <div className="border-t my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <Link to="/courses" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Courses
            </Link>
            <Link to="/about" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
            <Link to="/certificates" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Certificates
            </Link>
            <Link to="/assignments" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Assignments
            </Link>
            <Link to="/quizzes" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Quizzes
            </Link>
            <Link to="/chat" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Messages
            </Link>
            {user ? (
              <>
                <div className="border-t pt-3 mt-3">
                  <Link to="/dashboard" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/notifications" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
                    Notifications
                  </Link>
                  {user.role === 'instructor' && (
                    <Link to="/instructor/dashboard" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
                      Instructor Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block text-red-600 hover:text-red-700 font-medium py-2">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-center block mt-2" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
