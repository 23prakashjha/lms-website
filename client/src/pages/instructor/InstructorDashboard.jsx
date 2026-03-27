import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, DollarSign, TrendingUp, Plus, HelpCircle, Edit, Trash2, Eye, FileText, Settings, ChevronDown, ChevronUp, BookMarked, ArrowRight, FileCheck, ClipboardList, ChevronRight } from 'lucide-react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatPrice } from '../../utils/priceFormatter'
import toast from 'react-hot-toast'

const InstructorDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    totalQuizzes: 0,
    totalAssignments: 0
  })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [courseQuizzes, setCourseQuizzes] = useState({})
  const [courseAssignments, setCourseAssignments] = useState({})
  const [showCreateDropdown, setShowCreateDropdown] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/courses/my-courses')
      setCourses(data.courses || [])
      
      let totalQuizzes = 0
      let totalAssignments = 0
      for (const course of data.courses) {
        try {
          const quizRes = await axios.get(`/api/quizzes/course/${course._id}`)
          totalQuizzes += quizRes.data.quizzes?.length || 0
        } catch (e) {}
        try {
          const assignRes = await axios.get(`/api/assignments/course/${course._id}`)
          totalAssignments += assignRes.data.assignments?.length || 0
        } catch (e) {}
      }
      
      const totalStudents = data.courses.reduce((acc, c) => acc + (c.totalStudents || 0), 0)
      setStats({
        totalCourses: data.courses.length,
        totalStudents,
        totalRevenue: totalStudents * 50,
        totalQuizzes,
        totalAssignments
      })
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuizzes = async (courseId) => {
    try {
      const { data } = await axios.get(`/api/quizzes/course/${courseId}`)
      setCourseQuizzes(prev => ({ ...prev, [courseId]: data.quizzes || [] }))
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    }
  }

  const fetchAssignments = async (courseId) => {
    try {
      const { data } = await axios.get(`/api/assignments/course/${courseId}`)
      setCourseAssignments(prev => ({ ...prev, [courseId]: data.assignments || [] }))
    } catch (error) {
      console.error('Error fetching assignments:', error)
    }
  }

  const deleteAssignment = async (assignmentId, courseId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return
    
    try {
      await axios.delete(`/api/assignments/${assignmentId}`)
      toast.success('Assignment deleted successfully')
      fetchAssignments(courseId)
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to delete assignment')
    }
  }

  const toggleCourse = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null)
    } else {
      setExpandedCourse(courseId)
      if (!courseQuizzes[courseId]) {
        fetchQuizzes(courseId)
      }
      if (!courseAssignments[courseId]) {
        fetchAssignments(courseId)
      }
    }
  }

  const deleteQuiz = async (quizId, courseId) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return
    
    try {
      await axios.delete(`/api/quizzes/${quizId}`)
      toast.success('Quiz deleted successfully')
      fetchQuizzes(courseId)
      fetchDashboardData()
    } catch (error) {
      toast.error('Failed to delete quiz')
    }
  }

  const chartData = [
    { name: 'Jan', students: 20 },
    { name: 'Feb', students: 35 },
    { name: 'Mar', students: 50 },
    { name: 'Apr', students: 45 },
    { name: 'May', students: 60 },
    { name: 'Jun', students: 75 }
  ]

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <div className="flex space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              
              {showCreateDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowCreateDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      Create New
                    </div>
                    <Link
                      to="/instructor/create-course"
                      onClick={() => setShowCreateDropdown(false)}
                      className="flex items-center px-4 py-3 hover:bg-primary-50 transition-colors"
                    >
                      <div className="bg-primary-100 p-2 rounded-lg mr-3">
                        <BookOpen className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Create Course</p>
                        <p className="text-xs text-gray-500">Add a new course</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                    </Link>
                    <Link
                      to="/instructor/quiz/create"
                      onClick={() => setShowCreateDropdown(false)}
                      className="flex items-center px-4 py-3 hover:bg-green-50 transition-colors"
                    >
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <HelpCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Create Quiz</p>
                        <p className="text-xs text-gray-500">Add a new quiz</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                    </Link>
                    <Link
                      to="/instructor/assignment/create"
                      onClick={() => setShowCreateDropdown(false)}
                      className="flex items-center px-4 py-3 hover:bg-amber-50 transition-colors"
                    >
                      <div className="bg-amber-100 p-2 rounded-lg mr-3">
                        <ClipboardList className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Create Assignment</p>
                        <p className="text-xs text-gray-500">Add a new assignment</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <HelpCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-amber-100 p-3 rounded-lg">
                <ClipboardList className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Growth</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <Link
                to="/instructor/create-course"
                className="flex items-center p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
              >
                <div className="bg-primary-100 p-3 rounded-xl mr-4">
                  <BookOpen className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Create Course</p>
                  <p className="text-sm text-gray-600">Add a new course to your account</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                to="/instructor/quiz/create"
                className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <HelpCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Create Quiz</p>
                  <p className="text-sm text-gray-600">Add a new quiz to your course</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              <Link
                to="/instructor/assignment/create"
                className="flex items-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
              >
                <div className="bg-amber-100 p-3 rounded-xl mr-4">
                  <ClipboardList className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Create Assignment</p>
                  <p className="text-sm text-gray-600">Add a new assignment to your course</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
            <Link to="/instructor/create-course" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              Create New Course
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Create your first course to get started</p>
              <Link to="/instructor/create-course" className="btn-primary inline-flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Create Course
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course._id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div 
                    className="flex items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleCourse(course._id)}
                  >
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/100'}
                      alt={course.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {course.totalStudents || 0} students
                        <span className="mx-2">•</span>
                        <HelpCircle className="h-4 w-4 mr-1" />
                        {courseQuizzes[course._id]?.length || 0} quizzes
                        <span className="mx-2">•</span>
                        <ClipboardList className="h-4 w-4 mr-1" />
                        {courseAssignments[course._id]?.length || 0} assignments
                        <span className="mx-2">•</span>
                        {course.isPublished ? (
                          <span className="text-green-600">Published</span>
                        ) : (
                          <span className="text-yellow-600">Draft</span>
                        )}
                      </div>
                    </div>
                    {expandedCourse === course._id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  {expandedCourse === course._id && (
                    <div className="p-4 border-t border-gray-200 bg-white space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <HelpCircle className="h-5 w-5 mr-2 text-green-600" />
                          Quizzes
                        </h4>
                        <Link
                          to={`/instructor/quiz/create/${course._id}`}
                          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create Quiz
                        </Link>
                      </div>

                      {courseQuizzes[course._id]?.length > 0 ? (
                        <div className="space-y-3">
                          {courseQuizzes[course._id].map((quiz) => (
                            <div key={quiz._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                  <HelpCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{quiz.title}</p>
                                  <p className="text-sm text-gray-500">
                                    {quiz.questions?.length || 0} questions • 
                                    {quiz.timeLimit ? ` ${quiz.timeLimit} min` : ' No limit'} • 
                                    Pass: {quiz.passingScore}%
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => deleteQuiz(quiz._id, course._id)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <HelpCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">No quizzes yet</p>
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <ClipboardList className="h-5 w-5 mr-2 text-amber-600" />
                            Assignments
                          </h4>
                          <Link
                            to={`/instructor/assignment/create/${course._id}`}
                            className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Create Assignment
                          </Link>
                        </div>

                        {courseAssignments[course._id]?.length > 0 ? (
                          <div className="space-y-3">
                            {courseAssignments[course._id].map((assignment) => (
                              <div key={assignment._id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                                <div className="flex items-center">
                                  <div className="bg-amber-100 p-2 rounded-lg mr-3">
                                    <ClipboardList className="h-5 w-5 text-amber-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{assignment.title}</p>
                                    <p className="text-sm text-gray-500">
                                      Max Score: {assignment.maxScore} • 
                                      {assignment.deadline ? ` Due: ${new Date(assignment.deadline).toLocaleDateString()}` : ' No deadline'} • 
                                      {assignment.submissions?.length || 0} submissions
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => deleteAssignment(assignment._id, course._id)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 bg-gray-50 rounded-lg">
                            <ClipboardList className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No assignments yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboard
