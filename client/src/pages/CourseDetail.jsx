import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, Users, Clock, BookOpen, Play, CheckCircle, Globe, Award, PlayCircle, Download, Share2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AuthContext from '../context/AuthContext'
import { formatPrice } from '../utils/priceFormatter'

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

  useEffect(() => {
    fetchCourseData()
  }, [slug])

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`/api/courses/${slug}`)
      setCourse(data.course)
      setLessons(data.lessons || [])
      setReviews(data.reviews || [])
      
      if (user) {
        const enrollment = await axios.get(`/api/enrollments/check/${data.course._id}`)
        setIsEnrolled(enrollment.data.isEnrolled)
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
        const { data } = await axios.post('/api/payments/create-order', { courseId: course._id })
        navigate(`/checkout/${data.order.id}`)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Course not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{course.category}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-primary-100 mb-6">{course.shortDescription || course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span>{course.averageRating || 0}</span>
                  <span className="text-primary-200 ml-1">({course.totalRatings || 0} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{course.totalStudents || 0} students</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-1" />
                  <span>{course.language}</span>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <img
                  src={course.instructor?.avatar || 'https://ui-avatars.com/api/?name=Instructor'}
                  alt={course.instructor?.name}
                  className="h-12 w-12 rounded-full mr-3"
                />
                <div>
                  <p className="text-primary-200 text-sm">Instructor</p>
                  <p className="font-semibold">{course.instructor?.name}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl p-6 text-gray-900">
                {course.thumbnail && (
                  <div className="relative mb-6 cursor-pointer" onClick={() => document.getElementById('preview-video')?.click()}>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <PlayCircle className="h-16 w-16 text-white" />
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  {course.discountPrice ? (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{formatPrice(course.discountPrice)}</span>
                      <span className="text-xl text-gray-400 line-through ml-3">{formatPrice(course.price)}</span>
                    </div>
                  ) : course.price === 0 ? (
                    <span className="text-4xl font-bold text-green-600">Free</span>
                  ) : (
                    <span className="text-4xl font-bold">{formatPrice(course.price)}</span>
                  )}
                </div>

                {isEnrolled ? (
                  <button onClick={handleStartLesson} className="btn-primary w-full mb-4">
                    Continue Learning
                  </button>
                ) : (
                  <button onClick={handleEnroll} className="btn-primary w-full mb-4">
                    {course.price === 0 ? 'Enroll for Free' : 'Buy Now'}
                  </button>
                )}

                <p className="text-center text-sm text-gray-500 mb-6">30-Day Money-Back Guarantee</p>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{Math.floor((course.totalDuration || 0) / 60)} hours</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-3 text-gray-400" />
                    <span>{lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-3 text-gray-400" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-5 w-5 mr-3 text-gray-400" />
                    <span>Full lifetime access</span>
                  </div>
                </div>

                <button className="mt-6 w-full flex items-center justify-center text-primary-600 hover:text-primary-700">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex space-x-8 border-b">
            {['overview', 'curriculum', 'reviews', 'instructor'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.whatYouWillLearn?.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  )) || (
                    <>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Comprehensive course content</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {course.requirements?.map((req, index) => (
                    <li key={index}>{req}</li>
                  )) || <li>Basic computer skills</li>}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
              <p className="text-gray-600">{lessons.length} lessons • {Math.floor((course.totalDuration || 0) / 60)} hours</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm">
              {lessons.map((lesson, index) => (
                <div key={lesson._id} className="p-4 border-b last:border-b-0 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${lesson.isPreview ? 'bg-primary-100' : 'bg-gray-100'}`}>
                      {lesson.isPreview ? (
                        <Play className="h-4 w-4 text-primary-600" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lesson.title}</p>
                      <p className="text-sm text-gray-500">{lesson.videoDuration || 0} min</p>
                    </div>
                  </div>
                  {lesson.isPreview && (
                    <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">Preview</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-center mb-8">
              <div className="text-center mr-8">
                <div className="text-5xl font-bold text-gray-900">{course.averageRating || 0}</div>
                <div className="flex items-center justify-center my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(course.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-500">{course.totalRatings || 0} reviews</p>
              </div>
            </div>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <img
                      src={review.user?.avatar || 'https://ui-avatars.com/api/?name=User'}
                      alt={review.user?.name}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{review.user?.name}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'instructor' && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-start">
              <img
                src={course.instructor?.avatar || 'https://ui-avatars.com/api/?name=Instructor'}
                alt={course.instructor?.name}
                className="h-24 w-24 rounded-full mr-6"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.instructor?.name}</h2>
                <p className="text-gray-600 mb-4">{course.instructor?.email}</p>
                <div className="flex items-center space-x-6 text-gray-600">
                  <span>{course.instructor?.createdCourses?.length || 0} courses</span>
                  <span>{course.instructor?.enrolledCourses?.length || 0} students</span>
                </div>
                <p className="mt-4 text-gray-700">{course.instructor?.bio || 'Expert instructor with years of experience in teaching and industry.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetail
