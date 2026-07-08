import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, Save, ArrowLeft, FileText, Calendar, Award, Upload, Clock, BookOpen } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const CreateAssignment = () => {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || '')
  const [courseName, setCourseName] = useState('')
  const [lessons, setLessons] = useState([])
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    instructions: '',
    maxScore: 100,
    deadline: '',
    lesson: '',
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt'],
    maxFileSize: 10485760
  })

  const fileTypes = [
    { value: '.pdf', label: 'PDF' },
    { value: '.doc', label: 'Word Document' },
    { value: '.docx', label: 'Word Document (.docx)' },
    { value: '.txt', label: 'Text File' },
    { value: '.zip', label: 'ZIP Archive' },
    { value: '.png', label: 'PNG Image' },
    { value: '.jpg', label: 'JPG Image' }
  ]

  const fileSizeOptions = [
    { value: 1048576, label: '1 MB' },
    { value: 5242880, label: '5 MB' },
    { value: 10485760, label: '10 MB' },
    { value: 26214400, label: '25 MB' },
    { value: 52428800, label: '50 MB' }
  ]

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourseId) {
      const selectedCourse = courses.find(c => c._id === selectedCourseId)
      setCourseName(selectedCourse?.title || '')
      setLessons(selectedCourse?.lessons || [])
    } else {
      setLessons([])
    }
  }, [selectedCourseId, courses])

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/api/courses/my-courses')
      setCourses(data.courses || [])
      if (courseId) {
        setSelectedCourseId(courseId)
        setLessons(data.courses.find(c => c._id === courseId)?.lessons || [])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setAssignment(prev => ({ ...prev, [name]: value }))
  }

  const toggleFileType = (type) => {
    setAssignment(prev => {
      const currentTypes = prev.allowedFileTypes
      if (currentTypes.includes(type)) {
        if (currentTypes.length === 1) {
          toast.error('At least one file type must be allowed')
          return prev
        }
        return { ...prev, allowedFileTypes: currentTypes.filter(t => t !== type) }
      } else {
        return { ...prev, allowedFileTypes: [...currentTypes, type] }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCourseId) {
      toast.error('Please select a course first')
      return
    }

    if (!assignment.title.trim()) {
      toast.error('Assignment title is required')
      return
    }

    if (!assignment.description.trim()) {
      toast.error('Assignment description is required')
      return
    }

    setLoading(true)
    try {
      const assignmentData = {
        ...assignment,
        course: selectedCourseId,
        lesson: assignment.lesson || null,
        maxScore: parseInt(assignment.maxScore) || 100,
        maxFileSize: parseInt(assignment.maxFileSize) || 10485760
      }

      await axios.post('/api/assignments', assignmentData)
      toast.success('Assignment created successfully!')
      navigate('/instructor/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assignment')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/instructor/dashboard')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Assignment</h1>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">Please create a course first before adding assignments.</p>
            <button
              onClick={() => navigate('/instructor/create-course')}
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Course
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-amber-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Select Course</h2>
              </div>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="input-field w-full"
              >
                <option value="">-- Select a course --</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title} {course.isPublished ? '(Published)' : '(Draft)'}
                  </option>
                ))}
              </select>
            </div>

            {selectedCourseId && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Assignment Details
                    <span className="ml-2 text-sm font-normal text-amber-600">
                      for: {courseName}
                    </span>
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignment Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={assignment.title}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. JavaScript Project Assignment"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={assignment.description}
                        onChange={handleChange}
                        rows={3}
                        className="input-field"
                        placeholder="Brief description of the assignment..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructions
                      </label>
                      <textarea
                        name="instructions"
                        value={assignment.instructions}
                        onChange={handleChange}
                        rows={4}
                        className="input-field"
                        placeholder="Detailed instructions for students on how to complete the assignment..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            Max Score *
                          </span>
                        </label>
                        <input
                          type="number"
                          name="maxScore"
                          value={assignment.maxScore}
                          onChange={handleChange}
                          className="input-field"
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Deadline (Optional)
                          </span>
                        </label>
                        <input
                          type="datetime-local"
                          name="deadline"
                          value={assignment.deadline}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                    </div>

                    {lessons.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Link to Lesson (Optional)
                        </label>
                        <select
                          name="lesson"
                          value={assignment.lesson}
                          onChange={handleChange}
                          className="input-field"
                        >
                          <option value="">Select a lesson (optional)</option>
                          {lessons.map((lesson, index) => (
                            <option key={lesson._id || index} value={lesson._id}>
                              {lesson.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Submission Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <span className="flex items-center">
                          <Upload className="h-4 w-4 mr-1" />
                          Allowed File Types
                        </span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {fileTypes.map(type => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => toggleFileType(type.value)}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                              assignment.allowedFileTypes.includes(type.value)
                                ? 'bg-primary-50 border-primary-500 text-primary-700'
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Max File Size
                        </span>
                      </label>
                      <select
                        name="maxFileSize"
                        value={assignment.maxFileSize}
                        onChange={handleChange}
                        className="input-field"
                      >
                        {fileSizeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-sm text-gray-500">
                        Current limit: {formatFileSize(assignment.maxFileSize)}
                      </p>
                    </div>
                  </div>
                </div>

                {assignment.deadline && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-start">
                      <Calendar className="h-6 w-6 text-amber-600 mt-0.5" />
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-amber-800">Deadline Set</h3>
                        <p className="mt-1 text-amber-700">
                          Students must submit their work before{' '}
                          <span className="font-semibold">
                            {new Date(assignment.deadline).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/instructor/dashboard')}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center disabled:opacity-50"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {loading ? 'Creating...' : 'Create Assignment'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CreateAssignment
