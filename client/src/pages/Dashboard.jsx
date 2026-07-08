import { useState, useEffect, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Award, Play, CheckCircle,
  FileText, HelpCircle, Bell, CreditCard, User,
  ArrowRight, Target, ChevronRight,
  Users, ExternalLink, MessageSquare,
  GraduationCap, Zap, BarChart3, DollarSign,
  Clock, TrendingUp, Sparkles, Star, RefreshCw,
  Layers, ChevronDown, Edit, Trash2
} from 'lucide-react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import ReviewForm from '../components/ReviewForm'
import { formatPrice } from '../utils/priceFormatter'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [enrollments, setEnrollments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [payments, setPayments] = useState([])
  const [courseAssignments, setCourseAssignments] = useState({})
  const [courseQuizzes, setCourseQuizzes] = useState({})
  const [myReviews, setMyReviews] = useState([])
  const [editingCourseId, setEditingCourseId] = useState(null)
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
        const { data: reviewData } = await axios.get('/api/courses/reviews/my-reviews')
        setMyReviews(reviewData.reviews || [])
      } catch (e) { /* ignore */ }

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

  const handleReviewSubmitted = async () => {
    try {
      const { data: reviewData } = await axios.get('/api/courses/reviews/my-reviews')
      setMyReviews(reviewData.reviews || [])
      setEditingCourseId(null)
    } catch { /* ignore */ }
  }

  const weekData = [
    { name: 'Mon', progress: 10, prevWeek: 8 },
    { name: 'Tue', progress: 25, prevWeek: 18 },
    { name: 'Wed', progress: 15, prevWeek: 22 },
    { name: 'Thu', progress: 40, prevWeek: 30 },
    { name: 'Fri', progress: 35, prevWeek: 28 },
    { name: 'Sat', progress: 60, prevWeek: 40 },
    { name: 'Sun', progress: 55, prevWeek: 45 }
  ]

  const unreadCount = notifications.filter(n => !n.isRead).length
  const continueCourse = enrollments.find(e => !e.isCompleted && e.progress > 0 && e.progress < 100)

  const overallProgress = useMemo(() => {
    if (enrollments.length === 0) return 0
    return Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length)
  }, [enrollments])

  const reviewedCourseIds = useMemo(() => new Set(myReviews.map(r => r.course?._id)), [myReviews])
  const coursesToReview = useMemo(() =>
    enrollments.filter(e => e.isCompleted && !reviewedCourseIds.has(e.course?._id)),
    [enrollments, reviewedCourseIds]
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto h-16 w-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
            <GraduationCap className="absolute inset-0 h-8 w-8 m-auto text-primary-600" />
          </div>
          <p className="text-gray-500 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-100/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Welcome Header */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=fff&color=3b82f6&size=128&bold=true`}
                  alt=""
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-white/30 shadow-lg object-cover"
                />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 border-2 border-primary-700 rounded-full"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'there'}!</h1>
                  <span className="hidden sm:inline-flex text-2xl">👋</span>
                </div>
                <p className="text-primary-100/90 mt-1 text-sm sm:text-base">Track your learning journey and stay on top of your goals</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchDashboardData} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/20 transition-all border border-white/10">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Link to="/courses" className="flex items-center bg-white text-primary-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-50 transition-all shadow-lg shadow-black/10 group">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Courses
                <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary-100 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <GraduationCap className="h-3.5 w-3.5" />Student
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary-100 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <Zap className="h-3.5 w-3.5" />{stats.totalHours}h learned
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary-100 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <Award className="h-3.5 w-3.5" />{stats.certificates} certificates
            </span>
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-red-200 bg-red-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-500/20 animate-pulse-slow">
                <Bell className="h-3.5 w-3.5" />{unreadCount} unread
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 space-y-6 pb-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-fade-up">
          {[
            { icon: BookOpen, label: 'Enrolled Courses', value: stats.enrolledCourses, gradient: 'from-primary-500 to-blue-600', shadow: 'shadow-primary-200/50', iconBg: 'bg-gradient-to-br from-primary-100 to-blue-50', iconColor: 'text-primary-600' },
            { icon: CheckCircle, label: 'Completed', value: stats.completedCourses, gradient: 'from-green-500 to-emerald-600', shadow: 'shadow-green-200/50', iconBg: 'bg-gradient-to-br from-green-100 to-emerald-50', iconColor: 'text-green-600' },
            { icon: FileText, label: 'Pending Assignments', value: stats.pendingAssignments, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-200/50', iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-50', iconColor: 'text-blue-600' },
            { icon: HelpCircle, label: 'Available Quizzes', value: stats.availableQuizzes, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-200/50', iconBg: 'bg-gradient-to-br from-amber-100 to-orange-50', iconColor: 'text-amber-600' },
          ].map((item, i) => (
            <div key={i} className="card card-hover p-5 group animate-scale-in" style={{ animationDelay: `${i * 75}ms` }}>
              <div className="flex items-center">
                <div className={`${item.iconBg} p-3.5 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
                  <p className={`text-2xl font-bold mt-0.5 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>{item.value}</p>
                </div>
              </div>
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${item.gradient} opacity-[0.03] pointer-events-none`}></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning Banner */}
            {continueCourse && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 shadow-xl animate-slide-right">
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full"></div>
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full animate-float"></div>
                <div className="relative p-5 sm:p-6 lg:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-primary-100 text-xs sm:text-sm font-medium mb-2">
                        <span className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          <Play className="h-3 w-3" /> Continue Learning
                        </span>
                        {continueCourse.course?.level && (
                          <span className="bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full">{continueCourse.course.level}</span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">{continueCourse.course?.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(continueCourse.course?.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-primary-100 font-medium">{continueCourse.course?.averageRating || 0}</span>
                        <span className="text-xs text-primary-200/80">({continueCourse.course?.totalRatings || 0} reviews)</span>
                      </div>
                      <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 w-full sm:max-w-xs">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-primary-100">Progress</span>
                            <span className="text-xs text-primary-100 font-semibold">{continueCourse.progress}%</span>
                          </div>
                          <div className="bg-white/20 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-white to-primary-200 transition-all duration-1000 ease-out relative"
                              style={{ width: `${continueCourse.progress}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                          </div>
                        </div>
                        <Link
                          to={`/course/${continueCourse.course?.slug || continueCourse.course?._id}/lesson/${continueCourse.course?.lessons?.[0]}`}
                          className="inline-flex items-center bg-white text-primary-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-50 transition-all text-sm shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                        >
                          <Play className="h-4 w-4 mr-1.5 fill-primary-700" /> Resume Course <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Link>
                      </div>
                    </div>
                    <img
                      src={continueCourse.course?.thumbnail || 'https://via.placeholder.com/120'}
                      alt=""
                      className="hidden sm:block w-28 h-28 lg:w-32 lg:h-32 rounded-xl object-cover shadow-lg flex-shrink-0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Progress Chart */}
            <div className="card p-5 sm:p-6 animate-fade-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-gradient-to-br from-primary-100 to-accent-100 p-1.5 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                  </span>
                  Weekly Progress
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-500"></span> This Week
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-200 ml-2"></span> Last Week
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">This week</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">Your learning activity over the past 7 days</p>
              <div className="h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weekData}>
                    <defs>
                      <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPrevWeek" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.08} />
                        <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(8px)'
                      }}
                      labelStyle={{ fontWeight: 600, color: '#1e293b' }}
                    />
                    <Area type="monotone" dataKey="prevWeek" stroke="#93c5fd" strokeWidth={2} fill="url(#colorPrevWeek)" dot={false} />
                    <Area type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorProgress)" dot={{ fill: '#3b82f6', stroke: '#fff', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* My Courses */}
            <div className="card p-5 sm:p-6 animate-fade-up">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-gradient-to-br from-primary-100 to-accent-100 p-1.5 rounded-xl">
                    <BookOpen className="h-5 w-5 text-primary-600" />
                  </span>
                  My Courses
                </h2>
                <Link to="/courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 group">
                  Browse More <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              {enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-gray-50 to-primary-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                    <BookOpen className="h-10 w-10 text-primary-400" />
                  </div>
                  <p className="text-gray-500 font-medium mb-2">You haven't enrolled in any courses yet</p>
                  <p className="text-sm text-gray-400 mb-5">Start your learning journey by exploring our courses</p>
                  <Link to="/courses" className="btn-primary inline-flex items-center text-sm">
                    <BookOpen className="h-4 w-4 mr-1.5" /> Explore Courses <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3">
                  {enrollments.map((enrollment, idx) => (
                    <div key={enrollment._id} className="card-hover p-3 sm:p-4 bg-gray-50/80 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all group" style={{ animationDelay: `${idx * 50}ms` }}>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={enrollment.course?.thumbnail || 'https://via.placeholder.com/80'}
                            alt={enrollment.course?.title}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl"
                          />
                          {enrollment.isCompleted && (
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 shadow-sm">
                              <CheckCircle className="h-3.5 w-3.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{enrollment.course?.title}</h3>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">{enrollment.course?.instructor?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < Math.round(enrollment.course?.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">{enrollment.course?.averageRating || 0}</span>
                          </div>
                          <div className="flex items-center gap-2.5 mt-2">
                            <div className="flex-1 max-w-[160px] bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-600 transition-all duration-700"
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-700 min-w-[2.5rem] text-right">{enrollment.progress}%</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {enrollment.isCompleted ? (
                            <span className="flex items-center text-green-600 text-xs font-semibold bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 whitespace-nowrap">
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />Done
                            </span>
                          ) : (
                            <Link
                              to={`/course/${enrollment.course?.slug || enrollment.course?._id}/lesson/${enrollment.course?.lessons?.[0]}`}
                              className="bg-gradient-to-br from-primary-500 to-accent-600 text-white p-2.5 sm:p-3 rounded-xl hover:shadow-lg hover:shadow-primary-200/50 transition-all flex group-hover:scale-110 active:scale-95"
                            >
                              <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Assignments */}
            {stats.pendingAssignments > 0 && (
              <div className="card p-5 sm:p-6 animate-fade-up">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <span className="bg-gradient-to-br from-blue-100 to-indigo-50 p-1.5 rounded-xl">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </span>
                  Upcoming Assignments
                </h2>
                <p className="text-sm text-gray-500 mb-4">Assignments pending submission</p>
                <div className="space-y-3">
                  {Object.entries(courseAssignments).map(([courseId, data]) =>
                    data.pending.map(assignment => {
                      const enrollment = enrollments.find(e => e.course?._id === courseId)
                      return (
                        <div key={assignment._id} className="flex items-center gap-3 sm:gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100 hover:shadow-md transition-all group">
                          <div className="bg-white p-2.5 rounded-xl shadow-sm"><FileText className="h-5 w-5 text-blue-600" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 text-sm">{assignment.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{enrollment?.course?.title}</p>
                              </div>
                              {assignment.deadline && (
                                <span className="text-xs text-red-500 flex items-center whitespace-nowrap bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                                  <Clock className="h-3 w-3 mr-1" />{new Date(assignment.deadline).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <Link to={`/assignment/${assignment._id}`} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all whitespace-nowrap shadow-sm hover:shadow-md active:scale-95">
                            Submit
                          </Link>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            {/* Available Quizzes */}
            {stats.availableQuizzes > 0 && (
              <div className="card p-5 sm:p-6 animate-fade-up">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <span className="bg-gradient-to-br from-amber-100 to-orange-50 p-1.5 rounded-xl">
                    <HelpCircle className="h-5 w-5 text-amber-600" />
                  </span>
                  Available Quizzes
                </h2>
                <p className="text-sm text-gray-500 mb-4">Quizzes ready for you to attempt</p>
                <div className="space-y-3">
                  {Object.entries(courseQuizzes).map(([courseId, data]) =>
                    data.available.map(quiz => {
                      const enrollment = enrollments.find(e => e.course?._id === courseId)
                      return (
                        <div key={quiz._id} className="flex items-center gap-3 sm:gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-xl border border-amber-100 hover:shadow-md transition-all group">
                          <div className="bg-white p-2.5 rounded-xl shadow-sm"><HelpCircle className="h-5 w-5 text-amber-600" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 text-sm">{quiz.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{enrollment?.course?.title}</p>
                              </div>
                              <span className="text-xs text-gray-400 whitespace-nowrap bg-white px-2 py-1 rounded-lg border border-gray-100">{quiz.questions?.length || 0} questions</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-1.5">
                                <div className="h-full rounded-full bg-amber-500" style={{ width: `${quiz.passingScore || 0}%` }}></div>
                              </div>
                              <span className="text-xs text-gray-400">{quiz.passingScore}% to pass</span>
                            </div>
                          </div>
                          <Link to={`/quiz/${quiz._id}`} className="bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-700 transition-all whitespace-nowrap shadow-sm hover:shadow-md active:scale-95">
                            Start
                          </Link>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}

            {/* Certificates Earned */}
            {stats.certificates > 0 && (
              <div className="card p-5 sm:p-6 animate-fade-up">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <span className="bg-gradient-to-br from-yellow-100 to-orange-50 p-1.5 rounded-xl">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </span>
                  Certificates Earned
                </h2>
                <p className="text-sm text-gray-500 mb-4">Courses you've successfully completed</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {enrollments.filter(e => e.isCompleted).map((enrollment) => (
                    <div key={enrollment._id} className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50/80 to-orange-50/80 rounded-xl border border-yellow-100/80 hover:shadow-md hover:border-yellow-200 transition-all group">
                      <div className="bg-white p-2.5 rounded-xl shadow-sm"><Award className="h-5 w-5 text-yellow-600" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{enrollment.course?.title}</p>
                        <p className="text-xs text-green-600 font-medium flex items-center mt-0.5"><CheckCircle className="h-3 w-3 mr-1" />Completed</p>
                      </div>
                      {enrollment.certificateId && (
                        <Link to={`/certificate/${enrollment.certificateId}`} className="text-yellow-600 hover:text-yellow-700 bg-white p-2 rounded-lg hover:shadow-md transition-all border border-yellow-100 group-hover:border-yellow-200">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Notifications */}
            <div className="card p-5 sm:p-6 animate-slide-left">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-gradient-to-br from-gray-100 to-gray-50 p-1.5 rounded-xl">
                    <Bell className="h-5 w-5 text-gray-600" />
                  </span>
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm shadow-red-200">{unreadCount}</span>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Bell className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-400">No notifications</p>
                  <p className="text-xs text-gray-300 mt-1">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-hide">
                  {notifications.slice(0, 5).map((n, i) => {
                    const typeStyles = {
                      grade: { bg: 'bg-gradient-to-r from-green-50 to-emerald-50', border: 'border-green-100', icon: 'bg-green-100 text-green-600', iconEl: Award },
                      enrollment: { bg: 'bg-gradient-to-r from-blue-50 to-indigo-50', border: 'border-blue-100', icon: 'bg-blue-100 text-blue-600', iconEl: BookOpen },
                      message: { bg: 'bg-gradient-to-r from-purple-50 to-pink-50', border: 'border-purple-100', icon: 'bg-purple-100 text-purple-600', iconEl: MessageSquare },
                      payment: { bg: 'bg-gradient-to-r from-emerald-50 to-green-50', border: 'border-emerald-100', icon: 'bg-emerald-100 text-emerald-600', iconEl: DollarSign },
                      default: { bg: 'bg-gradient-to-r from-gray-50 to-slate-50', border: 'border-gray-100', icon: 'bg-gray-100 text-gray-600', iconEl: Bell }
                    }
                    const style = typeStyles[n.type] || typeStyles.default
                    const IconComponent = style.iconEl
                    return (
                      <div
                        key={n._id || i}
                        className={`p-3.5 rounded-xl border transition-all ${n.isRead ? 'bg-white hover:bg-gray-50 border-transparent' : `${style.bg} ${style.border} shadow-sm`} animate-scale-in`}
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl flex-shrink-0 transition-colors ${n.isRead ? 'bg-gray-100 text-gray-500' : style.icon}`}>
                            <IconComponent className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-relaxed ${n.isRead ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(n.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {!n.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary-500 flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="card p-5 sm:p-6 animate-slide-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <span className="bg-gradient-to-br from-gray-100 to-gray-50 p-1.5 rounded-xl">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                </span>
                Quick Stats
              </h2>
              <div className="space-y-5">
                <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 border border-primary-100/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary-600" />Overall Progress
                    </span>
                    <span className="text-sm font-bold gradient-text">{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-accent-600 transition-all duration-1000 ease-out relative"
                      style={{ width: `${overallProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: FileText, label: 'Assignments Done', value: enrollments.reduce((a, e) => a + (e.completedAssignments?.length || 0), 0), color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { icon: HelpCircle, label: 'Quizzes Taken', value: enrollments.reduce((a, e) => a + (e.quizAttempts?.length || 0), 0), color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
                    { icon: Award, label: 'Certificates', value: stats.certificates, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-100' },
                    { icon: TrendingUp, label: 'Hours Learned', value: `${stats.totalHours}h`, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' },
                  ].map((item, i) => (
                    <div key={i} className={`${item.bg} ${item.border} border rounded-xl p-3 hover:shadow-sm transition-all`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                        <span className="text-xs text-gray-500">{item.label}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            {payments.length > 0 && (
              <div className="card p-5 sm:p-6 animate-slide-left">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-gradient-to-br from-emerald-100 to-green-50 p-1.5 rounded-xl">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                  </span>
                  Recent Payments
                </h2>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-hide">
                  {payments.slice(0, 4).map((payment) => (
                    <div key={payment._id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-sm hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="bg-gradient-to-br from-green-100 to-emerald-50 p-2 rounded-xl flex-shrink-0"><DollarSign className="h-4 w-4 text-green-600" /></div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{payment.course?.title || 'Course'}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />{new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 ml-3 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100">{formatPrice(payment.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card p-5 sm:p-6 animate-slide-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-gradient-to-br from-gray-100 to-gray-50 p-1.5 rounded-xl">
                  <Zap className="h-5 w-5 text-gray-600" />
                </span>
                Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  { to: '/courses', icon: BookOpen, label: 'Browse Courses', color: 'from-primary-50 to-blue-50', iconColor: 'text-primary-600', border: 'border-primary-100' },
                  { to: '/profile', icon: User, label: 'Edit Profile', color: 'from-green-50 to-emerald-50', iconColor: 'text-green-600', border: 'border-green-100' },
                  { to: '/certificates', icon: Award, label: 'My Certificates', color: 'from-yellow-50 to-orange-50', iconColor: 'text-yellow-600', border: 'border-yellow-100' },
                  { to: '/coding-practice', icon: Sparkles, label: 'Coding Practice', color: 'from-purple-50 to-pink-50', iconColor: 'text-purple-600', border: 'border-purple-100' },
                  { to: '/coding-practice', icon: Layers, label: 'Learning Paths', color: 'from-indigo-50 to-blue-50', iconColor: 'text-indigo-600', border: 'border-indigo-100' },
                ].map((item, i) => (
                  <Link
                    key={i}
                    to={item.to}
                    className={`flex items-center gap-3 p-3.5 bg-gradient-to-r ${item.color} rounded-xl border ${item.border} hover:shadow-md transition-all group hover:-translate-y-0.5 active:translate-y-0`}
                  >
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            {/* My Reviews */}
            <div className="card p-5 sm:p-6 animate-slide-left">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-gradient-to-br from-yellow-100 to-orange-50 p-1.5 rounded-xl">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </span>
                  My Reviews
                </h2>
                <div className="flex items-center gap-2">
                  {coursesToReview.length > 0 && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                      {coursesToReview.length} to review
                    </span>
                  )}
                  {myReviews.length > 0 && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{myReviews.length}</span>
                  )}
                </div>
              </div>

              {/* Courses needing review */}
              {coursesToReview.length > 0 && editingCourseId === null && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Courses to Review</p>
                  <div className="space-y-2">
                    {coursesToReview.slice(0, 3).map((enrollment) => (
                      <div key={enrollment._id} className="flex items-center gap-3 p-2.5 bg-orange-50/50 rounded-xl border border-orange-100/50">
                        <div className="flex-shrink-0">
                          {enrollment.course?.thumbnail ? (
                            <img src={enrollment.course.thumbnail} alt="" className="h-9 w-9 rounded-lg object-cover" />
                          ) : (
                            <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center">
                              <BookOpen className="h-4 w-4 text-orange-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{enrollment.course?.title}</p>
                        </div>
                        <button
                          onClick={() => setEditingCourseId(enrollment.course?._id)}
                          className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-all whitespace-nowrap font-medium"
                        >
                          Write Review
                        </button>
                      </div>
                    ))}
                    {coursesToReview.length > 3 && (
                      <p className="text-xs text-gray-400 text-center pt-1">+{coursesToReview.length - 3} more courses</p>
                    )}
                  </div>
                </div>
              )}

              {/* Inline review form */}
              {editingCourseId && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {myReviews.find(r => r.course?._id === editingCourseId) ? 'Edit Review' : 'Write a Review'}
                    </p>
                    <button
                      onClick={() => setEditingCourseId(null)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                  <ReviewForm
                    courseId={editingCourseId}
                    existingReview={myReviews.find(r => r.course?._id === editingCourseId) || null}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </div>
              )}

              {/* Existing reviews */}
              {myReviews.length === 0 && editingCourseId === null ? (
                <div className="text-center py-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-7 w-7 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">No reviews yet</p>
                  <p className="text-xs text-gray-400">Review your completed courses to help others</p>
                </div>
              ) : editingCourseId === null && (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-hide">
                  {myReviews.map((review, i) => {
                    const courseSlug = review.course?.slug || review.course?._id
                    return (
                      <div key={review._id} className="p-3.5 bg-gradient-to-r from-yellow-50/50 to-orange-50/30 rounded-xl border border-yellow-100/50 hover:shadow-sm transition-all animate-scale-in group" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {review.course?.thumbnail ? (
                              <img src={review.course.thumbnail} alt="" className="h-10 w-10 rounded-lg object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-yellow-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-gray-900 truncate">{review.course?.title || 'Course'}</p>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                <button
                                  onClick={() => setEditingCourseId(review.course?._id)}
                                  className="p-1 rounded-lg hover:bg-yellow-200/50 text-gray-400 hover:text-yellow-700 transition-all"
                                  title="Edit"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 my-1">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className={`h-3 w-3 ${idx < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            {review.comment && (
                              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{review.comment}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5">
                              <Link
                                to={`/courses/${courseSlug}`}
                                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-0.5"
                              >
                                View Course <ExternalLink className="h-3 w-3" />
                              </Link>
                              <span className="text-[10px] text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
