import { useState, useEffect, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Users, DollarSign, TrendingUp, Plus, HelpCircle, Edit, Trash2, Eye, FileText, Settings, ChevronDown, ChevronUp, BookMarked, ArrowRight, FileCheck, ClipboardList, ChevronRight, X, Briefcase, GraduationCap, Globe, Award, Calendar, Upload, Building2 } from 'lucide-react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatPrice } from '../../utils/priceFormatter'
import toast from 'react-hot-toast'
import AuthContext from '../../context/AuthContext'

const InstructorDashboard = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useContext(AuthContext)
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
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarInputRef = useRef(null)
  const [profileForm, setProfileForm] = useState({
    name: '', bio: '', avatar: '', skills: '',
    highestQualification: '', subjects: '', languages: '', currentCompany: '', totalExperience: 0,
    experience: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        skills: user.skills?.join(', ') || '',
        highestQualification: user.highestQualification || '',
        subjects: user.subjects?.join(', ') || '',
        languages: user.languages?.join(', ') || '',
        currentCompany: user.currentCompany || '',
        totalExperience: user.totalExperience || 0,
        experience: user.experience || []
      })
    }
  }, [user])

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const { data } = await axios.post('/api/upload/avatar', formData)
      setProfileForm(prev => ({ ...prev, avatar: data.url }))
      toast.success('Avatar uploaded')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const addExperience = () => {
    setProfileForm(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', startDate: '', endDate: '', description: '', current: false }]
    }))
  }

  const removeExperience = (index) => {
    setProfileForm(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const updateExperience = (index, field, value) => {
    setProfileForm(prev => {
      const updated = [...prev.experience]
      updated[index] = { ...updated[index], [field]: value }
      if (field === 'current' && value === true) {
        updated[index].endDate = ''
      }
      return { ...prev, experience: updated }
    })
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.put('/api/users/profile', {
        name: profileForm.name,
        bio: profileForm.bio,
        avatar: profileForm.avatar,
        skills: profileForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        highestQualification: profileForm.highestQualification,
        subjects: profileForm.subjects.split(',').map(s => s.trim()).filter(Boolean),
        languages: profileForm.languages.split(',').map(s => s.trim()).filter(Boolean),
        currentCompany: profileForm.currentCompany,
        totalExperience: Number(profileForm.totalExperience),
        experience: profileForm.experience
      })
      updateUser(data.user)
      toast.success('Profile updated successfully')
      setShowProfileModal(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

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

  const deleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return
    
    try {
      await axios.delete(`/api/courses/${courseId}`)
      toast.success('Course deleted successfully')
      setCourses(prev => prev.filter(c => c._id !== courseId))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course')
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

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-5">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Instructor'}&background=3b82f6&color=fff`}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Instructor'}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                {user?.bio && <p className="text-gray-600 mt-2 max-w-lg text-sm">{user.bio}</p>}
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
                  {user?.highestQualification && (
                    <span className="flex items-center"><GraduationCap className="h-4 w-4 mr-1 text-primary-600" />{user.highestQualification}</span>
                  )}
                  {user?.currentCompany && (
                    <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1 text-primary-600" />{user.currentCompany}</span>
                  )}
                  {user?.totalExperience > 0 && (
                    <span className="flex items-center"><Calendar className="h-4 w-4 mr-1 text-primary-600" />{user.totalExperience} years exp.</span>
                  )}
                </div>
                {user?.subjects?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {user.subjects.map((s, i) => <span key={i} className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full">{s}</span>)}
                  </div>
                )}
                {user?.languages?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.languages.map((l, i) => <span key={i} className="flex items-center px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full"><Globe className="h-3 w-3 mr-1" />{l}</span>)}
                  </div>
                )}
                {user?.experience?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center mb-2"><Briefcase className="h-4 w-4 mr-1 text-primary-600" />Experience</h4>
                    <div className="space-y-3">
                      {user.experience.map((exp, i) => (
                        <div key={i} className="border-l-2 border-primary-200 pl-3">
                          <p className="text-sm font-medium text-gray-900">{exp.position}</p>
                          <p className="text-xs text-gray-600">{exp.company}</p>
                          <p className="text-xs text-gray-400">
                            {exp.startDate && new Date(exp.startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                            {' - '}
                            {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
                          </p>
                          {exp.description && <p className="text-xs text-gray-500 mt-1">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setShowProfileModal(true)} className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium text-sm px-4 py-2 border border-primary-200 rounded-lg hover:bg-primary-50">
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
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
                    <div className="flex items-center space-x-2 mr-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/instructor/edit-course/${course._id}`) }}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteCourse(course._id) }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <img
                    src={profileForm.avatar || `https://ui-avatars.com/api/?name=${profileForm.name || 'Instructor'}&background=3b82f6&color=fff`}
                    alt=""
                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-1.5 rounded-full hover:bg-primary-700 disabled:opacity-50"
                  >
                    {uploadingAvatar ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Click camera icon to upload photo</p>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Your name" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Tell us about yourself" className="input-field" rows="3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
                <input type="text" value={profileForm.highestQualification} onChange={(e) => setProfileForm({ ...profileForm, highestQualification: e.target.value })} placeholder="e.g. Master's in Computer Science" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
                <input type="text" value={profileForm.currentCompany} onChange={(e) => setProfileForm({ ...profileForm, currentCompany: e.target.value })} placeholder="e.g. Google, Microsoft" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Experience (years)</label>
                <input type="number" value={profileForm.totalExperience} onChange={(e) => setProfileForm({ ...profileForm, totalExperience: e.target.value })} placeholder="e.g. 5" className="input-field" min="0" />
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">Experience</label>
                  <button type="button" onClick={addExperience} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                    <Plus className="h-4 w-4 mr-1" /> Add Experience
                  </button>
                </div>
                {profileForm.experience.map((exp, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 mb-3 space-y-3 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Entry {i + 1}</span>
                      <button type="button" onClick={() => removeExperience(i)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
                        <input type="text" value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} placeholder="Company name" className="input-field text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Position</label>
                        <input type="text" value={exp.position} onChange={(e) => updateExperience(i, 'position', e.target.value)} placeholder="Job title" className="input-field text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                        <input type="month" value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} className="input-field text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                        <input type="month" value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} className="input-field text-sm" disabled={exp.current} />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id={`current-${i}`} checked={exp.current} onChange={(e) => updateExperience(i, 'current', e.target.checked)} className="h-4 w-4 text-primary-600 rounded border-gray-300" />
                      <label htmlFor={`current-${i}`} className="ml-2 text-sm text-gray-600">I currently work here</label>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                      <textarea value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} placeholder="Describe your role and achievements" className="input-field text-sm" rows="2" />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subjects / Topics you teach (comma separated)</label>
                <input type="text" value={profileForm.subjects} onChange={(e) => setProfileForm({ ...profileForm, subjects: e.target.value })} placeholder="e.g. JavaScript, React, Node.js" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages you speak (comma separated)</label>
                <input type="text" value={profileForm.languages} onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })} placeholder="e.g. English, Hindi, Spanish" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                <input type="text" value={profileForm.skills} onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })} placeholder="e.g. Teaching, Communication, Leadership" className="input-field" />
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InstructorDashboard
