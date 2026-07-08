import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, Users, Clock, BookOpen, Play, CheckCircle, Globe, Award, PlayCircle, Download, Share2, ChevronDown, ChevronUp, ChevronRight, GraduationCap, BarChart3, MessageSquare, Sparkles, User } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AuthContext from '../context/AuthContext'
import { formatPrice } from '../utils/priceFormatter'
import ReviewForm from '../components/ReviewForm'

const CourseDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [userReview, setUserReview] = useState(null)
  const [expandedLesson, setExpandedLesson] = useState(null)

  useEffect(() => {
    fetchCourseData()
  }, [slug, user])

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`/api/courses/${slug}`)
      setCourse(data.course)
      setLessons(data.lessons || [])
      setReviews(data.reviews || [])
      
      if (user) {
        const enrollment = await axios.get(`/api/enrollments/check/${data.course._id}`)
        setIsEnrolled(enrollment.data.isEnrolled)
        if (enrollment.data.isEnrolled) {
          try {
            const myReview = await axios.get(`/api/courses/${data.course._id}/reviews/mine`)
            setUserReview(myReview.data.review || null)
          } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error)
      toast.error('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${slug}` } })
      return
    }

    try {
      if (course.price === 0) {
        await axios.post('/api/enrollments/free-enroll', { courseId: course._id })
        toast.success('Successfully enrolled!')
        setIsEnrolled(true)
        navigate(`/course/${course._id}/lesson/${lessons[0]?._id}`)
      } else {
        navigate(`/checkout/${course._id}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed')
    }
  }

  const handleStartLesson = () => {
    const firstLesson = lessons.find(l => l.isPreview) || lessons[0]
    if (firstLesson) {
      navigate(`/course/${course._id}/lesson/${firstLesson._id}`)
    }
  }

  const handleReviewSubmitted = async () => {
    const { data } = await axios.get(`/api/courses/${slug}`)
    setReviews(data.reviews || [])
    setCourse(data.course)
    try {
      const myReview = await axios.get(`/api/courses/${data.course._id}/reviews/mine`)
      setUserReview(myReview.data.review || null)
    } catch { /* ignore */ }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'instructor', label: 'Instructor', icon: GraduationCap },
  ]

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => Math.floor(r.rating) === star).length
    return { star, count, percentage: reviews.length ? (count / reviews.length) * 100 : 0 }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary-600 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center animate-fade-in">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-500 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/courses" className="btn-primary inline-flex">Browse Courses</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6 animate-fade-up">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full border border-white/10">
                  <BookOpen className="h-3.5 w-3.5" />
                  {course.category}
                </span>
                {course.level && (
                  <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-sm px-4 py-1.5 rounded-full border border-white/10">
                    <BarChart3 className="h-3.5 w-3.5" />
                    {course.level}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight text-balance">
                {course.title}
              </h1>

              <p className="text-lg text-primary-100/90 max-w-2xl leading-relaxed">
                {course.shortDescription || course.description?.slice(0, 200)}
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-primary-100">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(course.averageRating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-white">{course.averageRating?.toFixed(1) || '0.0'}</span>
                  <span className="text-white/60">({course.totalRatings || 0})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-primary-200" />
                  <span>{course.totalStudents || 0} students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-primary-200" />
                  <span>{course.language || 'English'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary-200" />
                  <span>{Math.floor((course.totalDuration || 0) / 60)}h {Math.round((course.totalDuration || 0) % 60)}m</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={course.instructor?.avatar || 'https://ui-avatars.com/api/?name=Instructor&background=6366f1&color=fff'}
                      alt={course.instructor?.name}
                      className="h-12 w-12 rounded-full ring-2 ring-white/30 object-cover"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full ring-2 ring-primary-800"></div>
                  </div>
                  <div>
                    <p className="text-primary-200 text-xs font-medium uppercase tracking-wider">Instructor</p>
                    <p className="text-white font-semibold">{course.instructor?.name}</p>
                  </div>
                </div>
                <span className="text-white/20 text-3xl font-thin">|</span>
                <div className="flex items-center gap-2 text-primary-100">
                  <Award className="h-5 w-5" />
                  <span className="text-sm">Certificate of Completion</span>
                </div>
              </div>
            </div>

            {/* Sidebar Card */}
            <div className="lg:col-span-1 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="lg:sticky lg:top-24">
                <div className="card overflow-hidden">
                  {course.thumbnail && (
                    <div className="relative group cursor-pointer" onClick={handleStartLesson}>
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-52 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-16 w-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Play className="h-7 w-7 text-primary-600 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-5">
                      {course.discountPrice ? (
                        <div className="flex items-baseline gap-3">
                          <span className="text-4xl font-extrabold text-gray-900">{formatPrice(course.discountPrice)}</span>
                          <span className="text-xl text-gray-400 line-through">{formatPrice(course.price)}</span>
                          <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                            {Math.round((1 - course.discountPrice / course.price) * 100)}% OFF
                          </span>
                        </div>
                      ) : course.price === 0 ? (
                        <span className="text-4xl font-extrabold text-green-600">Free</span>
                      ) : (
                        <span className="text-4xl font-extrabold text-gray-900">{formatPrice(course.price)}</span>
                      )}
                    </div>

                    {isEnrolled ? (
                      <button onClick={handleStartLesson} className="btn-primary w-full mb-3 flex items-center justify-center gap-2 text-lg">
                        <Play className="h-5 w-5" />
                        Continue Learning
                      </button>
                    ) : (
                      <button onClick={handleEnroll} className="btn-primary w-full mb-3 flex items-center justify-center gap-2 text-lg">
                        <Sparkles className="h-5 w-5" />
                        {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                      </button>
                    )}

                    <p className="text-center text-sm text-gray-400 mb-6">
                      <CheckCircle className="h-3.5 w-3.5 inline mr-1 text-green-500" />
                      30-Day Money-Back Guarantee
                    </p>

                    <div className="border-t border-gray-100 pt-5 space-y-3.5">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-3.5 text-gray-400" />
                        <span className="text-sm">{Math.floor((course.totalDuration || 0) / 60)} hours on-demand video</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-5 w-5 mr-3.5 text-gray-400" />
                        <span className="text-sm">{lessons.length} lessons</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Download className="h-5 w-5 mr-3.5 text-gray-400" />
                        <span className="text-sm">Full lifetime access</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Globe className="h-5 w-5 mr-3.5 text-gray-400" />
                        <span className="text-sm">{course.language || 'English'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Award className="h-5 w-5 mr-3.5 text-gray-400" />
                        <span className="text-sm">Certificate of completion</span>
                      </div>
                    </div>

                    <button className="mt-6 w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors py-2 rounded-xl hover:bg-gray-50">
                      <Share2 className="h-4 w-4" />
                      Share this course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Tabs */}
        <div className="mb-10">
          <div className="flex space-x-1 bg-white rounded-2xl p-1.5 shadow-soft max-w-xl mx-auto lg:mx-0">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === id
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in" key={activeTab}>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2 space-y-10">
                {/* What You'll Learn */}
                <div className="card p-6 lg:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                    What you'll learn
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(course.whatYouWillLearn?.length ? course.whatYouWillLearn : ['Comprehensive course content']).map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curriculum / Course Modules */}
                {course.curriculum?.length > 0 && (
                  <div className="card p-6 lg:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                      Course Curriculum
                    </h2>
                    <div className="flex flex-wrap gap-3 mb-5 pb-5 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm bg-primary-50 text-primary-700 px-4 py-2 rounded-full font-medium">
                        <BookOpen className="h-4 w-4" />
                        {lessons.length} Lectures
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-accent-50 text-accent-700 px-4 py-2 rounded-full font-medium">
                        <Clock className="h-4 w-4" />
                        {Math.floor((course.totalDuration || 0) / 60)}h {Math.round((course.totalDuration || 0) % 60)}m
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {course.curriculum.map((module, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700 text-sm">
                          <span className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold text-primary-600">
                            {index + 1}
                          </span>
                          {module}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                {course.requirements?.length > 0 && (
                  <div className="card p-6 lg:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary-600" />
                      Requirements
                    </h2>
                    <ul className="space-y-3">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700 text-sm">
                          <span className="h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <ChevronRight className="h-3 w-3 text-primary-600" />
                          </span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Projects */}
                {course.projects?.length > 0 && (
                  <div className="card p-6 lg:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary-600" />
                      Projects
                    </h2>
                    <ul className="space-y-3">
                      {course.projects.map((project, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700 text-sm">
                          <span className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <ChevronRight className="h-3 w-3 text-amber-600" />
                          </span>
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interview Preparation */}
                {course.interviewPrep?.length > 0 && (
                  <div className="card p-6 lg:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary-600" />
                      Interview Preparation
                    </h2>
                    <ul className="space-y-3">
                      {course.interviewPrep.map((topic, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700 text-sm">
                          <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <ChevronRight className="h-3 w-3 text-purple-600" />
                          </span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* DSA Practice */}
                {course.dsaPractice?.length > 0 && (
                  <div className="card p-6 lg:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary-600" />
                      DSA Practice
                    </h2>
                    <ul className="space-y-3">
                      {course.dsaPractice.map((topic, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700 text-sm">
                          <span className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <ChevronRight className="h-3 w-3 text-green-600" />
                          </span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Description */}
                <div className="card p-6 lg:p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary-600" />
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{course.description}</p>
                </div>
              </div>

              {/* Sidebar Highlights */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 space-y-6">
                  <div className="card p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Course Highlights</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-transparent">
                        <div className="h-10 w-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{Math.floor((course.totalDuration || 0) / 60)}h {Math.round((course.totalDuration || 0) % 60)}m</p>
                          <p className="text-xs text-gray-500">Total duration</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent-50 to-transparent">
                        <div className="h-10 w-10 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-accent-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{lessons.length} lessons</p>
                          <p className="text-xs text-gray-500">Structured curriculum</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-transparent">
                        <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{course.totalStudents || 0} students</p>
                          <p className="text-xs text-gray-500">Already enrolled</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-transparent">
                        <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                          <Award className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Certificate</p>
                          <p className="text-xs text-gray-500">Upon completion</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                  <p className="text-gray-500 mt-1">{lessons.length} lessons • {Math.floor((course.totalDuration || 0) / 60)}h {Math.round((course.totalDuration || 0) % 60)}m total</p>
                </div>
                <span className="text-sm text-gray-400 bg-gray-100 px-4 py-2 rounded-full">
                  {lessons.filter(l => l.isPreview).length} preview available
                </span>
              </div>

              <div className="space-y-2">
                {lessons.length > 0 ? (
                  lessons.map((lesson, index) => {
                    const isExpanded = expandedLesson === lesson._id
                    return (
                      <div
                        key={lesson._id}
                        className={`card overflow-hidden transition-all duration-300 ${
                          isExpanded ? 'ring-1 ring-primary-200' : ''
                        }`}
                      >
                        <button
                          onClick={() => setExpandedLesson(isExpanded ? null : lesson._id)}
                          className="w-full flex items-center justify-between p-4 lg:p-5 text-left hover:bg-gray-50/80 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              lesson.isPreview
                                ? 'bg-primary-100 text-primary-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {lesson.isPreview ? (
                                <Play className="h-4 w-4" />
                              ) : (
                                <BookOpen className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 font-mono">Lesson {index + 1}</span>
                                {lesson.isPreview && (
                                  <span className="text-[10px] font-semibold bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">FREE</span>
                                )}
                              </div>
                              <p className="font-medium text-gray-900 mt-0.5">{lesson.title}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-sm text-gray-400">{lesson.videoDuration || 0} min</span>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="px-4 lg:px-5 pb-4 lg:pb-5 animate-fade-down">
                            <div className="pt-3 border-t border-gray-100">
                              <p className="text-sm text-gray-500">{lesson.description || 'No additional details available for this lesson.'}</p>
                              {lesson.isPreview && (
                                <button
                                  onClick={() => navigate(`/course/${course._id}/lesson/${lesson._id}`)}
                                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                                >
                                  <Play className="h-4 w-4" />
                                  Preview this lesson
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="card p-12 text-center">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Curriculum content is being added.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-4xl">
              {/* Rating Summary */}
              <div className="card p-6 lg:p-8 mb-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
                  <div className="text-center flex-shrink-0">
                    <div className="text-6xl font-extrabold gradient-text">
                      {course.averageRating?.toFixed(1) || '0.0'}
                    </div>
                    <div className="flex items-center justify-center gap-0.5 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(course.averageRating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{course.totalRatings || 0} total reviews</p>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    {ratingDistribution.map(({ star, percentage, count }) => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 w-8 text-right">{star}</span>
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-400 w-8">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Form */}
              {user ? (
                isEnrolled ? (
                  <div className="mb-8 animate-fade-up">
                    <ReviewForm
                      courseId={course._id}
                      existingReview={userReview}
                      onReviewSubmitted={handleReviewSubmitted}
                    />
                  </div>
                ) : (
                  <div className="mb-8 p-5 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-100 text-center">
                    <GraduationCap className="h-8 w-8 text-primary-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Enroll in this course to leave a review</p>
                    <button onClick={handleEnroll} className="mt-3 btn-primary text-sm inline-flex items-center">
                      <Sparkles className="h-4 w-4 mr-1.5" /> Enroll Now
                    </button>
                  </div>
                )
              ) : (
                <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Sign in to share your experience</p>
                  <Link to={`/login?redirect=/courses/${slug}`} className="mt-3 inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-semibold">
                    <User className="h-4 w-4 mr-1" /> Log in to Review
                  </Link>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <div
                      key={review._id}
                      className="card p-6 animate-fade-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={review.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'}
                          alt={review.user?.name}
                          className="h-11 w-11 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-1">
                            <p className="font-semibold text-gray-900">{review.user?.name}</p>
                            <span className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-500">Be the first to share your experience with this course!</p>
                  {!user && (
                    <Link to={`/login?redirect=/courses/${slug}`} className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center">
                      <User className="h-4 w-4 mr-1" /> Sign in to review
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'instructor' && (
            <div className="max-w-4xl">
              <div className="card overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 h-32"></div>
                <div className="px-6 lg:px-8 pb-8 -mt-16">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <img
                      src={course.instructor?.avatar || 'https://ui-avatars.com/api/?name=Instructor&background=6366f1&color=fff&size=128'}
                      alt={course.instructor?.name}
                      className="h-28 w-28 rounded-2xl object-cover ring-4 ring-white shadow-xl flex-shrink-0"
                    />
                    <div className="pt-14 sm:pt-0 sm:mt-16 flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">{course.instructor?.name}</h2>
                      <p className="text-gray-500">{course.instructor?.headline || 'Instructor'}</p>
                      <div className="flex flex-wrap items-center gap-5 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
                          <Award className="h-4 w-4 text-primary-600" />
                          <span>{course.instructor?.createdCourses?.length || 0} courses</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
                          <Users className="h-4 w-4 text-accent-600" />
                          <span>{course.instructor?.totalStudents || course.instructor?.enrolledCourses?.length || 0} students</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{course.averageRating?.toFixed(1) || '0.0'} rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">About the Instructor</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {course.instructor?.bio || 'Expert instructor with years of experience in teaching and industry.'}
                    </p>
                  </div>
                  {course.instructor?.skills?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.instructor.skills.map((skill, i) => (
                          <span key={i} className="text-sm bg-primary-50 text-primary-600 px-3.5 py-1.5 rounded-full font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
