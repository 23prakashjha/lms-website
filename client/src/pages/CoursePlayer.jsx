import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Play, CheckCircle, ChevronLeft, ChevronRight, BookOpen, MessageCircle, FileText } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AuthContext from '../context/AuthContext'

const CoursePlayer = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    fetchCourseData()
  }, [courseId, lessonId])

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`/api/courses/course/${courseId}`)
      setCourse(data.course)
      setLessons(data.lessons || [])

      const enrollment = await axios.get(`/api/enrollments/course/${courseId}`)
      setCompletedLessons(enrollment.data.enrollment?.completedLessons || [])

      const lesson = data.lessons?.find(l => l._id === lessonId)
      setCurrentLesson(lesson)
    } catch (error) {
      console.error('Error fetching course:', error)
      toast.error('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    try {
      await axios.put(`/api/enrollments/course/${courseId}/lesson-complete`, {
        lessonId: currentLesson._id
      })
      toast.success('Lesson completed!')
      setCompletedLessons([...completedLessons, currentLesson._id])
    } catch (error) {
      toast.error('Failed to mark complete')
    }
  }

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l._id === currentLesson._id)
    if (currentIndex < lessons.length - 1) {
      navigate(`/course/${courseId}/lesson/${lessons[currentIndex + 1]._id}`)
    }
  }

  const handlePrevLesson = () => {
    const currentIndex = lessons.findIndex(l => l._id === currentLesson._id)
    if (currentIndex > 0) {
      navigate(`/course/${courseId}/lesson/${lessons[currentIndex - 1]._id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-gray-800 transition-all duration-300 overflow-hidden flex-shrink-0`}>
        <div className="p-4 border-b border-gray-700">
          <Link to={`/courses/${course?.slug}`} className="flex items-center text-gray-300 hover:text-white">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Course
          </Link>
          <h2 className="mt-4 font-semibold">{course?.title}</h2>
          <div className="mt-2 bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full"
              style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {completedLessons.length} of {lessons.length} completed
          </p>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-200px)]">
          {lessons.map((lesson, index) => (
            <button
              key={lesson._id}
              onClick={() => navigate(`/course/${courseId}/lesson/${lesson._id}`)}
              className={`w-full p-4 text-left border-b border-gray-700 flex items-start ${
                lesson._id === lessonId ? 'bg-primary-600' : 'hover:bg-gray-700'
              }`}
            >
              <div className="mr-3 mt-1">
                {completedLessons.includes(lesson._id) ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium">{lesson.title}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {lesson.videoDuration || 0} min
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="bg-gray-800 p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-300 hover:text-white">
            {sidebarOpen ? 'Hide' : 'Show'} Sidebar
          </button>
          <div className="flex space-x-4">
            <button className="flex items-center text-gray-300 hover:text-white">
              <MessageCircle className="h-5 w-5 mr-1" />
              Discussion
            </button>
            <button className="flex items-center text-gray-300 hover:text-white">
              <FileText className="h-5 w-5 mr-1" />
              Resources
            </button>
          </div>
        </div>

        <div className="flex-1 p-8">
          {currentLesson?.videoUrl ? (
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
              <video
                src={currentLesson.videoUrl}
                controls
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="h-20 w-20 text-gray-600" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevLesson}
              disabled={lessons.findIndex(l => l._id === currentLesson?._id) === 0}
              className="btn-secondary disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5 mr-1 inline" />
              Previous
            </button>

            {!completedLessons.includes(currentLesson?._id) && (
              <button onClick={handleMarkComplete} className="btn-primary">
                <CheckCircle className="h-5 w-5 mr-2" />
                Mark as Complete
              </button>
            )}

            <button
              onClick={handleNextLesson}
              disabled={lessons.findIndex(l => l._id === currentLesson?._id) === lessons.length - 1}
              className="btn-primary disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1 inline" />
            </button>
          </div>

          <div className="mt-8 bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">{currentLesson?.title}</h3>
            <p className="text-gray-300">{currentLesson?.description}</p>
            {currentLesson?.content && (
              <div className="mt-4 prose prose-invert" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default CoursePlayer
