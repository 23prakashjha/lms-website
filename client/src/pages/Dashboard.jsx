import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Award, Play, CheckCircle,
  FileText, HelpCircle, Bell, CreditCard, User,
  ArrowRight, Target, ChevronRight,
  Users, ExternalLink, MessageSquare,
  GraduationCap, Zap, BarChart3, DollarSign
} from 'lucide-react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatPrice } from '../utils/priceFormatter'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [enrollments, setEnrollments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [payments, setPayments] = useState([])
  const [courseAssignments, setCourseAssignments] = useState({})
  const [courseQuizzes, setCourseQuizzes] = useState({})
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0,
    pendingAssignments: 0,
    availableQuizzes: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data: enrollData } = await axios.get('/api/enrollments/my-enrollments')
      const enrollments = enrollData.enrollments || []
      setEnrollments(enrollments)

      const completed = enrollments.filter(e => e.isCompleted).length
      const completedAssignmentsCount = enrollments.reduce((acc, e) => acc + (e.completedAssignments?.length || 0), 0)
      const quizAttemptsCount = enrollments.reduce((acc, e) => acc + (e.quizAttempts?.length || 0), 0)

      setStats(prev => ({
        ...prev,
        enrolledCourses: enrollments.length,
        completedCourses: completed,
        totalHours: Math.floor(enrollments.reduce((acc, e) => acc + (e.course?.totalDuration || 0), 0) / 60),
        certificates: completed
      }))

      const notifRes = await axios.get('/api/notifications')
      setNotifications(notifRes.data.notifications || [])

      try {
        const payRes = await axios.get('/api/payments/my-payments')
        setPayments(payRes.data.payments || [])
      } catch (e) { /* payment may not be set up */ }

      const enrolledCourses = enrollments.filter(e => !e.isCompleted)
      const assignPromises = enrolledCourses.map(e =>
        axios.get(`/api/assignments/course/${e.course?._id}`)
          .then(res => ({ courseId: e.course?._id, assignments: res.data.assignments || [], enrollment: e }))
          .catch(() => ({ courseId: e.course?._id, assignments: [], enrollment: e }))
      )
      const quizPromises = enrolledCourses.map(e =>
        axios.get(`/api/quizzes/course/${e.course?._id}`)
          .then(res => ({ courseId: e.course?._id, quizzes: res.data.quizzes || [], enrollment: e }))
          .catch(() => ({ courseId: e.course?._id, quizzes: [], enrollment: e }))
      )

      const [assignResults, quizResults] = await Promise.all([Promise.all(assignPromises), Promise.all(quizPromises)])

      const assignMap = {}
      let pendingCount = 0
      assignResults.forEach(r => {
        const completedIds = new Set((r.enrollment.completedAssignments || []).map(ca => ca.assignment?.toString()))
        const pending = r.assignments.filter(a => !completedIds.has(a._id?.toString()))
        pendingCount += pending.length
        assignMap[r.courseId] = { all: r.assignments, pending }
      })
      setCourseAssignments(assignMap)

      const quizMap = {}
      let availableCount = 0
      quizResults.forEach(r => {
        const attemptedIds = new Set((r.enrollment.quizAttempts || []).map(qa => qa.quiz?.toString()))
        const available = r.quizzes.filter(q => q.isPublished !== false && !attemptedIds.has(q._id?.toString()))
        availableCount += available.length
        quizMap[r.courseId] = { all: r.quizzes, available }
      })
      setCourseQuizzes(quizMap)

      setStats(prev => ({ ...prev, pendingAssignments: pendingCount, availableQuizzes: availableCount }))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const weekData = [
    { name: 'Mon', progress: 10 },
    { name: 'Tue', progress: 25 },
    { name: 'Wed', progress: 15 },
    { name: 'Thu', progress: 40 },
    { name: 'Fri', progress: 35 },
    { name: 'Sat', progress: 60 },
    { name: 'Sun', progress: 55 }
  ]

  const unreadCount = notifications.filter(n => !n.isRead).length
  const continueCourse = enrollments.find(e => !e.isCompleted && e.progress > 0 && e.progress < 100)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. Welcome Hero */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3b82f6&color=fff`}
                alt=""
                className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                <p className="text-gray-500 mt-1">Continue your learning journey and track your progress.</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="flex items-center text-sm text-gray-500"><GraduationCap className="h-4 w-4 mr-1 text-primary-600" />Student</span>
                  <span className="flex items-center text-sm text-gray-500"><Zap className="h-4 w-4 mr-1 text-yellow-500" />{stats.totalHours}h learned</span>
                  {unreadCount > 0 && (
                    <span className="flex items-center text-sm text-red-500"><Bell className="h-4 w-4 mr-1" />{unreadCount} unread</span>
                  )}
                </div>
              </div>
            </div>
            <Link to="/courses" className="btn-primary text-sm px-4 py-2 hidden sm:flex items-center">
              Browse Courses <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* 2. Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg"><BookOpen className="h-5 w-5 text-primary-600" /></div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Enrolled Courses</p>
                <p className="text-xl font-bold text-gray-900">{stats.enrolledCourses}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg"><CheckCircle className="h-5 w-5 text-green-600" /></div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-xl font-bold text-gray-900">{stats.completedCourses}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg"><FileText className="h-5 w-5 text-blue-600" /></div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Pending Assignments</p>
                <p className="text-xl font-bold text-gray-900">{stats.pendingAssignments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center">
              <div className="bg-amber-100 p-3 rounded-lg"><HelpCircle className="h-5 w-5 text-amber-600" /></div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Available Quizzes</p>
                <p className="text-xl font-bold text-gray-900">{stats.availableQuizzes}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left + Center Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* 3. Continue Learning */}
            {continueCourse && (
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-sm p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-primary-100 text-sm font-medium flex items-center"><Play className="h-4 w-4 mr-1" />Continue Learning</p>
                    <h3 className="text-xl font-bold mt-1">{continueCourse.course?.title}</h3>
                    <div className="mt-3 flex items-center">
                      <div className="flex-1 bg-white bg-opacity-30 rounded-full h-2 max-w-xs">
                        <div className="bg-white h-2 rounded-full" style={{ width: `${continueCourse.progress}%` }}></div>
                      </div>
                      <span className="ml-3 text-sm text-primary-100">{continueCourse.progress}% complete</span>
                    </div>
                    <Link
                      to={`/course/${continueCourse.course?.slug || continueCourse.course?._id}/lesson/${continueCourse.course?.lessons?.[0]}`}
                      className="mt-4 inline-flex items-center bg-white text-primary-700 px-5 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-sm"
                    >
                      Resume <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  <img
                    src={continueCourse.course?.thumbnail || 'https://via.placeholder.com/120'}
                    alt=""
                    className="hidden sm:block w-24 h-24 rounded-xl object-cover ml-4"
                  />
                </div>
              </div>
            )}

            {/* 4. Weekly Progress Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Weekly Progress</h2>
              <p className="text-sm text-gray-500 mb-4">Your learning activity this week</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 5. My Courses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
                <Link to="/courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                  Browse More <ChevronRight className="h-4 w-4 ml-0.5" />
                </Link>
              </div>
              {enrollments.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet</p>
                  <Link to="/courses" className="btn-primary inline-flex items-center text-sm">Explore Courses <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment._id} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <img
                        src={enrollment.course?.thumbnail || 'https://via.placeholder.com/80'}
                        alt={enrollment.course?.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-3 flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{enrollment.course?.title}</h3>
                        <p className="text-xs text-gray-500">{enrollment.course?.instructor?.name}</p>
                        <div className="flex items-center mt-1.5">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[120px]">
                            <div className="bg-primary-600 h-1.5 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }}></div>
                          </div>
                          <span className="ml-2 text-xs text-gray-600 font-medium">{enrollment.progress}%</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {enrollment.isCompleted ? (
                          <span className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded"><CheckCircle className="h-3 w-3 mr-1" />Done</span>
                        ) : (
                          <Link
                            to={`/course/${enrollment.course?.slug || enrollment.course?._id}/lesson/${enrollment.course?.lessons?.[0]}`}
                            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            <Play className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Upcoming Assignments */}
            {stats.pendingAssignments > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center"><FileText className="h-5 w-5 mr-2 text-blue-600" />Upcoming Assignments</h2>
                <p className="text-sm text-gray-500 mb-4">Assignments pending submission</p>
                <div className="space-y-3">
                  {Object.entries(courseAssignments).map(([courseId, data]) =>
                    data.pending.map(assignment => {
                      const enrollment = enrollments.find(e => e.course?._id === courseId)
                      return (
                        <div key={assignment._id} className="flex items-center p-3 bg-blue-50 rounded-xl">
                          <div className="bg-blue-100 p-2 rounded-lg"><FileText className="h-5 w-5 text-blue-600" /></div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">{assignment.title}</p>
                            <p className="text-xs text-gray-500 truncate">{enrollment?.course?.title}</p>
                            {assignment.deadline && (
                              <p className="text-xs text-red-500 mt-0.5">Due {new Date(assignment.deadline).toLocaleDateString()}</p>
                            )}
                          </div>
                          <Link to={`/assignment/${assignment._id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium ml-2">Submit</Link>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            {/* 7. Available Quizzes */}
            {stats.availableQuizzes > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center"><HelpCircle className="h-5 w-5 mr-2 text-amber-600" />Available Quizzes</h2>
                <p className="text-sm text-gray-500 mb-4">Quizzes ready for you to attempt</p>
                <div className="space-y-3">
                  {Object.entries(courseQuizzes).map(([courseId, data]) =>
                    data.available.map(quiz => {
                      const enrollment = enrollments.find(e => e.course?._id === courseId)
                      return (
                        <div key={quiz._id} className="flex items-center p-3 bg-amber-50 rounded-xl">
                          <div className="bg-amber-100 p-2 rounded-lg"><HelpCircle className="h-5 w-5 text-amber-600" /></div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">{quiz.title}</p>
                            <p className="text-xs text-gray-500 truncate">{enrollment?.course?.title}</p>
                            <p className="text-xs text-gray-400">{quiz.questions?.length || 0} questions • {quiz.passingScore}% to pass</p>
                          </div>
                          <Link to={`/quiz/${quiz._id}`} className="text-amber-600 hover:text-amber-700 text-sm font-medium ml-2">Start</Link>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            {/* 8. Certificates Earned */}
            {stats.certificates > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center"><Award className="h-5 w-5 mr-2 text-yellow-600" />Certificates Earned</h2>
                <p className="text-sm text-gray-500 mb-4">Courses you've successfully completed</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {enrollments.filter(e => e.isCompleted).map((enrollment) => (
                    <div key={enrollment._id} className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                      <div className="bg-yellow-100 p-2 rounded-lg"><Award className="h-5 w-5 text-yellow-600" /></div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{enrollment.course?.title}</p>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>
                      {enrollment.certificateId && (
                        <Link to={`/certificate/${enrollment.certificateId}`} className="text-yellow-600 hover:text-yellow-700"><ExternalLink className="h-4 w-4" /></Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">

            {/* 9. Notifications */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center"><Bell className="h-5 w-5 mr-2 text-gray-600" />Notifications</h2>
                {unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
              </div>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No notifications</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.slice(0, 5).map((n, i) => (
                    <div key={n._id || i} className={`p-3 rounded-xl ${n.isRead ? 'bg-gray-50' : 'bg-primary-50 border border-primary-100'}`}>
                      <div className="flex items-start">
                        <div className={`p-1.5 rounded-lg ${n.isRead ? 'bg-gray-200' : 'bg-primary-100'}`}>
                          {n.type === 'grade' ? <Award className="h-3.5 w-3.5 text-green-600" /> :
                           n.type === 'enrollment' ? <BookOpen className="h-3.5 w-3.5 text-blue-600" /> :
                           n.type === 'message' ? <MessageSquare className="h-3.5 w-3.5 text-purple-600" /> :
                           <Bell className="h-3.5 w-3.5 text-gray-600" />}
                        </div>
                        <p className="ml-2 text-xs text-gray-700 flex-1">{n.message}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 ml-9">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 10. Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><BarChart3 className="h-5 w-5 mr-2 text-gray-600" />Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center"><Target className="h-4 w-4 mr-2 text-primary-500" />Overall Progress</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {enrollments.length > 0 ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${enrollments.length > 0 ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length) : 0}%` }}></div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600 flex items-center"><FileText className="h-4 w-4 mr-2 text-blue-500" />Assignments Done</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {enrollments.reduce((a, e) => a + (e.completedAssignments?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600 flex items-center"><HelpCircle className="h-4 w-4 mr-2 text-amber-500" />Quizzes Taken</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {enrollments.reduce((a, e) => a + (e.quizAttempts?.length || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600 flex items-center"><Award className="h-4 w-4 mr-2 text-yellow-500" />Certificates</span>
                  <span className="text-sm font-semibold text-gray-900">{stats.certificates}</span>
                </div>
              </div>
            </div>

            {/* 11. Payment History */}
            {payments.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><CreditCard className="h-5 w-5 mr-2 text-gray-600" />Recent Payments</h2>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {payments.slice(0, 4).map((payment) => (
                    <div key={payment._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="bg-green-100 p-1.5 rounded-lg"><DollarSign className="h-4 w-4 text-green-600" /></div>
                        <div className="ml-2 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{payment.course?.title || 'Course'}</p>
                          <p className="text-xs text-gray-400">{new Date(payment.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gray-900 ml-2">{formatPrice(payment.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link to="/courses" className="flex items-center p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                  <BookOpen className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Browse Courses</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </Link>
                <Link to={`/profile`} className="flex items-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <User className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Edit Profile</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </Link>
                <Link to="/instructor" className="flex items-center p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                  <Users className="h-5 w-5 text-amber-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Our Instructors</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard