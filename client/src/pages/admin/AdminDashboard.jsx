import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, BookOpen, DollarSign, TrendingUp, Shield, Edit, Trash2, Plus, X, GraduationCap, School, Search, Award, CheckCircle, ExternalLink } from 'lucide-react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatPrice } from '../../utils/priceFormatter'
import toast from 'react-hot-toast'

const defaultCertForm = {
  userId: '', studentName: '', courseName: '', instructorName: '',
  certificateTitle: 'Certificate of Completion',
  studentId: '', studentPhoto: '',
  courseLevel: '', courseDuration: '', totalHours: 0, technologies: '',
  grade: '', percentage: 0, quizScore: 0, projectScore: 0,
  instructorSignature: '',
  directorName: '', directorSignature: '', officialStamp: '',
  description: '', qrCode: '', verificationUrl: '', skills: '',
  accreditationIso: false, accreditationPartner: ''
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeUsers: 0
  })
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userFilter, setUserFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  })
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [courseForm, setCourseForm] = useState({ title: '', description: '', price: '', category: '', level: '' })
  const [certificates, setCertificates] = useState([])
  const [certForm, setCertForm] = useState({ ...defaultCertForm })
  const [showCertModal, setShowCertModal] = useState(false)
  const [editingCert, setEditingCert] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersRes, coursesRes, paymentsRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/courses'),
        axios.get('/api/payments/all')
      ])

      setUsers(usersRes.data.users)
      setCourses(coursesRes.data.courses)

      const instructors = usersRes.data.users.filter(u => u.role === 'instructor').length
      const students = usersRes.data.users.filter(u => u.role === 'student').length

      setStats({
        totalUsers: usersRes.data.users.length,
        totalCourses: coursesRes.data.courses.length,
        totalRevenue: paymentsRes.data.totalRevenue || 0,
        activeUsers: students + instructors
      })

      try {
        const certRes = await axios.get('/api/certificates')
        setCertificates(certRes.data.certificates || [])
      } catch (e) { /* cert routes may not exist */ }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditCourse = (course) => {
    setEditingCourse(course)
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      price: course.price || '',
      category: course.category || '',
      level: course.level || ''
    })
    setShowCourseModal(true)
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    if (!editingCourse) return
    try {
      await axios.put(`/api/courses/${editingCourse._id}`, {
        title: courseForm.title,
        description: courseForm.description,
        price: parseFloat(courseForm.price) || 0,
        category: courseForm.category,
        level: courseForm.level
      })
      toast.success('Course updated successfully')
      setShowCourseModal(false)
      setEditingCourse(null)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update course')
    }
  }

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Delete "${courseTitle}"? This cannot be undone.`)) return
    try {
      await axios.delete(`/api/courses/${courseId}`)
      toast.success('Course deleted')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course')
    }
  }

  const handleCreateCertificate = async (e) => {
    e.preventDefault()
    if (!certForm.studentName || !certForm.courseName) {
      toast.error('Student name and course name are required')
      return
    }
    try {
      const technologies = certForm.technologies ? certForm.technologies.split(',').map(t => t.trim()).filter(Boolean) : []
      const skills = certForm.skills ? certForm.skills.split(',').map(s => s.trim()).filter(Boolean) : []

      await axios.post('/api/certificates', {
        userId: certForm.userId || undefined,
        studentName: certForm.studentName,
        courseName: certForm.courseName,
        instructorName: certForm.instructorName || 'Instructor',
        certificateTitle: certForm.certificateTitle,
        studentId: certForm.studentId,
        studentPhoto: certForm.studentPhoto,
        courseLevel: certForm.courseLevel,
        courseDuration: certForm.courseDuration,
        totalHours: Number(certForm.totalHours) || 0,
        technologies,
        grade: certForm.grade,
        percentage: Number(certForm.percentage) || 0,
        quizScore: Number(certForm.quizScore) || 0,
        projectScore: Number(certForm.projectScore) || 0,
        instructorSignature: certForm.instructorSignature,
        directorName: certForm.directorName,
        directorSignature: certForm.directorSignature,
        officialStamp: certForm.officialStamp,
        description: certForm.description,
        qrCode: certForm.qrCode,
        verificationUrl: certForm.verificationUrl,
        skills,
        accreditation: {
          isoCertified: certForm.accreditationIso,
          industryPartner: certForm.accreditationPartner
        }
      })
      toast.success('Certificate created successfully')
      setCertForm({ ...defaultCertForm })
      setShowCertModal(false)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create certificate')
    }
  }

  const handleEditCert = (cert) => {
    setEditingCert(cert)
    setCertForm({
      userId: cert.user?._id || cert.user || '',
      studentName: cert.studentName || '',
      courseName: cert.courseName || '',
      instructorName: cert.instructorName || '',
      certificateTitle: cert.certificateTitle || 'Certificate of Completion',
      studentId: cert.studentId || '',
      studentPhoto: cert.studentPhoto || '',
      courseLevel: cert.courseLevel || '',
      courseDuration: cert.courseDuration || '',
      totalHours: cert.totalHours || 0,
      technologies: (cert.technologies || []).join(', '),
      grade: cert.grade || '',
      percentage: cert.percentage || 0,
      quizScore: cert.quizScore || 0,
      projectScore: cert.projectScore || 0,
      instructorSignature: cert.instructorSignature || '',
      directorName: cert.directorName || '',
      directorSignature: cert.directorSignature || '',
      officialStamp: cert.officialStamp || '',
      description: cert.description || '',
      qrCode: cert.qrCode || '',
      verificationUrl: cert.verificationUrl || '',
      skills: (cert.skills || []).join(', '),
      accreditationIso: cert.accreditation?.isoCertified || false,
      accreditationPartner: cert.accreditation?.industryPartner || ''
    })
    setShowCertModal(true)
  }

  const handleUpdateCert = async (e) => {
    e.preventDefault()
    if (!editingCert) return
    if (!certForm.studentName || !certForm.courseName) {
      toast.error('Student name and course name are required')
      return
    }
    try {
      const technologies = certForm.technologies ? certForm.technologies.split(',').map(t => t.trim()).filter(Boolean) : []
      const skills = certForm.skills ? certForm.skills.split(',').map(s => s.trim()).filter(Boolean) : []

      await axios.put(`/api/certificates/${editingCert._id}`, {
        userId: certForm.userId || undefined,
        studentName: certForm.studentName,
        courseName: certForm.courseName,
        instructorName: certForm.instructorName || 'Instructor',
        certificateTitle: certForm.certificateTitle,
        studentId: certForm.studentId,
        studentPhoto: certForm.studentPhoto,
        courseLevel: certForm.courseLevel,
        courseDuration: certForm.courseDuration,
        totalHours: Number(certForm.totalHours) || 0,
        technologies,
        grade: certForm.grade,
        percentage: Number(certForm.percentage) || 0,
        quizScore: Number(certForm.quizScore) || 0,
        projectScore: Number(certForm.projectScore) || 0,
        instructorSignature: certForm.instructorSignature,
        directorName: certForm.directorName,
        directorSignature: certForm.directorSignature,
        officialStamp: certForm.officialStamp,
        description: certForm.description,
        qrCode: certForm.qrCode,
        verificationUrl: certForm.verificationUrl,
        skills,
        accreditation: {
          isoCertified: certForm.accreditationIso,
          industryPartner: certForm.accreditationPartner
        }
      })
      toast.success('Certificate updated successfully')
      setShowCertModal(false)
      setEditingCert(null)
      setCertForm({ ...defaultCertForm })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update certificate')
    }
  }

  const handleDeleteCert = async (certId, studentName) => {
    if (!window.confirm(`Delete certificate for "${studentName}"? This cannot be undone.`)) return
    try {
      await axios.delete(`/api/certificates/${certId}`)
      toast.success('Certificate deleted')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete certificate')
    }
  }

  const chartData = [
    { name: 'Mon', users: 45 },
    { name: 'Tue', users: 52 },
    { name: 'Wed', users: 61 },
    { name: 'Thu', users: 55 },
    { name: 'Fri', users: 70 },
    { name: 'Sat', users: 85 },
    { name: 'Sun', users: 78 }
  ]

  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }
    try {
      await axios.post('/api/auth/admin/register', formData)
      toast.success('User created successfully')
      setShowAddModal(false)
      setFormData({ name: '', email: '', password: '', role: 'student' })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user')
    }
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      await axios.put(`/api/users/${editingUser._id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role
      })
      toast.success('User updated successfully')
      setShowEditModal(false)
      setEditingUser(null)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user')
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return
    }
    try {
      await axios.delete(`/api/users/${userId}`)
      toast.success('User deleted successfully')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesRole = userFilter === 'all' || u.role === userFilter
    const matchesSearch = !searchTerm || 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRole && matchesSearch
  })

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
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
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Activity</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                    user.role === 'instructor' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUserFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  userFilter === 'all' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setUserFilter('instructor')}
                className={`flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  userFilter === 'instructor' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <School className="h-4 w-4" />
                <span>Instructors</span>
              </button>
              <button
                onClick={() => setUserFilter('student')}
                className={`flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  userFilter === 'student' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Students</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="input-field pl-9 py-2 text-sm"
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                          alt={user.name}
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        {user.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                        user.role === 'instructor' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.isVerified ? (
                        <span className="text-green-600 text-sm">Verified</span>
                      ) : (
                        <span className="text-yellow-600 text-sm">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingUser(user)
                            setShowEditModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="text-center text-gray-500 py-8">No users found</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center"><BookOpen className="h-5 w-5 mr-2 text-primary-600" />Manage Courses</h2>
          </div>
          {courses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No courses found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Students</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <img src={course.thumbnail || 'https://via.placeholder.com/40'} alt="" className="h-10 w-10 rounded-lg object-cover mr-3" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{course.title}</p>
                            <p className="text-xs text-gray-500">{course.instructor?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{course.category || '-'}</td>
                      <td className="py-3 px-4 text-sm">{course.price === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(course.price)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{course.totalStudents || 0}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditCourse(course)} className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteCourse(course._id, course.title)} className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                          <Link to={`/courses/${course.slug}`} className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50"><ExternalLink className="h-4 w-4" /></Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center"><Award className="h-5 w-5 mr-2 text-yellow-600" />Certificates</h2>
            <button onClick={() => setShowCertModal(true)} className="btn-primary text-sm py-2">
              <Plus className="h-4 w-4 mr-1 inline" />Create Certificate
            </button>
          </div>

          {certificates.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No certificates issued yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Issue Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Certificate ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Platform</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => (
                    <tr key={cert._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3"><Award className="h-4 w-4 text-yellow-600" /></div>
                          <span className="text-sm font-medium text-gray-900">{cert.studentName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{cert.courseName}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{new Date(cert.issueDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-xs text-gray-400 font-mono">{cert.certificateId}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">PrakashEdu</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditCert(cert)} className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteCert(cert._id, cert.studentName)} className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                          <Link to={`/certificate/${cert._id}`} className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50"><ExternalLink className="h-4 w-4" /></Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showCertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-lg font-semibold text-gray-900">{editingCert ? 'Edit Certificate' : 'Create New Certificate'}</h3>
              <button onClick={() => { setShowCertModal(false); setEditingCert(null); setCertForm({ ...defaultCertForm }) }} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={editingCert ? handleUpdateCert : handleCreateCertificate} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Title</label>
                <select value={certForm.certificateTitle} onChange={(e) => setCertForm({ ...certForm, certificateTitle: e.target.value })} className="input-field">
                  <option value="Certificate of Completion">Certificate of Completion</option>
                  <option value="Certificate of Achievement">Certificate of Achievement</option>
                  <option value="Certificate of Excellence">Certificate of Excellence</option>
                </select>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Student Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Student (for certificate ownership)</label>
                    <select value={certForm.userId} onChange={(e) => {
                      const selected = users.find(u => u._id === e.target.value)
                      setCertForm({ ...certForm, userId: e.target.value, studentName: selected ? selected.name : certForm.studentName })
                    }} className="input-field">
                      <option value="">-- No user link --</option>
                      {users.filter(u => u.role === 'student' || u.role === 'instructor').map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" value={certForm.studentName} onChange={(e) => setCertForm({ ...certForm, studentName: e.target.value })} placeholder="e.g. John Doe" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input type="text" value={certForm.studentId} onChange={(e) => setCertForm({ ...certForm, studentId: e.target.value })} placeholder="e.g. STU-001" className="input-field" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo URL</label>
                    <input type="text" value={certForm.studentPhoto} onChange={(e) => setCertForm({ ...certForm, studentPhoto: e.target.value })} placeholder="https://..." className="input-field" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Course Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                    <input type="text" value={certForm.courseName} onChange={(e) => setCertForm({ ...certForm, courseName: e.target.value })} placeholder="e.g. Complete MERN Stack" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Level</label>
                    <select value={certForm.courseLevel} onChange={(e) => setCertForm({ ...certForm, courseLevel: e.target.value })} className="input-field">
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Duration</label>
                    <input type="text" value={certForm.courseDuration} onChange={(e) => setCertForm({ ...certForm, courseDuration: e.target.value })} placeholder="e.g. 12 weeks" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours</label>
                    <input type="number" value={certForm.totalHours} onChange={(e) => setCertForm({ ...certForm, totalHours: e.target.value })} placeholder="e.g. 120" className="input-field" min="0" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma separated)</label>
                    <input type="text" value={certForm.technologies} onChange={(e) => setCertForm({ ...certForm, technologies: e.target.value })} placeholder="e.g. HTML5, CSS3, JavaScript, React" className="input-field" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Performance (Optional)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <input type="text" value={certForm.grade} onChange={(e) => setCertForm({ ...certForm, grade: e.target.value })} placeholder="e.g. A+" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                    <input type="number" value={certForm.percentage} onChange={(e) => setCertForm({ ...certForm, percentage: e.target.value })} placeholder="e.g. 95" className="input-field" min="0" max="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Score</label>
                    <input type="number" value={certForm.quizScore} onChange={(e) => setCertForm({ ...certForm, quizScore: e.target.value })} placeholder="e.g. 90" className="input-field" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Score</label>
                    <input type="number" value={certForm.projectScore} onChange={(e) => setCertForm({ ...certForm, projectScore: e.target.value })} placeholder="e.g. 98" className="input-field" min="0" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Instructor & Organization</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Name</label>
                    <input type="text" value={certForm.instructorName} onChange={(e) => setCertForm({ ...certForm, instructorName: e.target.value })} placeholder="e.g. Jane Smith" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Signature URL</label>
                    <input type="text" value={certForm.instructorSignature} onChange={(e) => setCertForm({ ...certForm, instructorSignature: e.target.value })} placeholder="https://..." className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Director/CEO Name</label>
                    <input type="text" value={certForm.directorName} onChange={(e) => setCertForm({ ...certForm, directorName: e.target.value })} placeholder="e.g. John Director" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Director Signature URL</label>
                    <input type="text" value={certForm.directorSignature} onChange={(e) => setCertForm({ ...certForm, directorSignature: e.target.value })} placeholder="https://..." className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Official Stamp URL</label>
                    <input type="text" value={certForm.officialStamp} onChange={(e) => setCertForm({ ...certForm, officialStamp: e.target.value })} placeholder="https://..." className="input-field" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Certificate Content</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={certForm.description} onChange={(e) => setCertForm({ ...certForm, description: e.target.value })} placeholder="e.g. This certificate is proudly presented to..." className="input-field" rows="3" />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                  <input type="text" value={certForm.skills} onChange={(e) => setCertForm({ ...certForm, skills: e.target.value })} placeholder="e.g. HTML5, CSS3, JavaScript, React" className="input-field" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Verification</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">QR Code URL</label>
                    <input type="text" value={certForm.qrCode} onChange={(e) => setCertForm({ ...certForm, qrCode: e.target.value })} placeholder="https://..." className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification URL</label>
                    <input type="text" value={certForm.verificationUrl} onChange={(e) => setCertForm({ ...certForm, verificationUrl: e.target.value })} placeholder="https://yourdomain.com/verify/..." className="input-field" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Accreditation</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={certForm.accreditationIso} onChange={(e) => setCertForm({ ...certForm, accreditationIso: e.target.checked })} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-gray-700">ISO Certified</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry Partner</label>
                    <input type="text" value={certForm.accreditationPartner} onChange={(e) => setCertForm({ ...certForm, accreditationPartner: e.target.value })} placeholder="e.g. Google, Microsoft" className="input-field" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <button type="button" onClick={() => { setShowCertModal(false); setEditingCert(null); setCertForm({ ...defaultCertForm }) }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">{editingCert ? 'Update Certificate' : 'Create Certificate'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCourseModal && editingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Edit Course</h3>
              <button onClick={() => { setShowCourseModal(false); setEditingCourse(null) }} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleUpdateCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} className="input-field" rows="3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input type="number" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })} className="input-field" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select value={courseForm.level} onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })} className="input-field">
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => { setShowCourseModal(false); setEditingCourse(null) }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Update Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-field"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder="Enter name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="Enter email"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="input-field"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  {editingUser.role === 'admin' && <option value="admin">Admin</option>}
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard