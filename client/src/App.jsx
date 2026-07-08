import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import CreateCourse from './pages/instructor/CreateCourse'
import EditCourse from './pages/instructor/EditCourse'
import InstructorDashboard from './pages/instructor/InstructorDashboard'
import CreateQuiz from './pages/instructor/CreateQuiz'
import CreateAssignment from './pages/instructor/CreateAssignment'
import ManageQuizzes from './pages/instructor/ManageQuizzes'
import AdminDashboard from './pages/admin/AdminDashboard'
import Profile from './pages/Profile'
import CoursePlayer from './pages/CoursePlayer'
import Assignments from './pages/Assignments'
import Quizzes from './pages/Quizzes'
import Certificates from './pages/Certificates'
import CertificateDetail from './pages/CertificateDetail'
import Chat from './pages/Chat'
import Notifications from './pages/Notifications'
import About from './pages/About'
import Contact from './pages/Contact'
import Instructor from './pages/Instructor'
import TakeQuiz from './pages/TakeQuiz'
import VerifyCertificate from './pages/VerifyCertificate'
import AIChat from './pages/AIChat'
import AIChatWidget from './components/AIChatWidget'
import CodingPractice from './pages/CodingPractice'
import Projects from './pages/Projects'
import Checkout from './pages/Checkout'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/instructor" element={<Instructor />} />
            <Route path="/ai-assistant" element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                <AIChat />
              </ProtectedRoute>
            } />
            <Route path="/coding-practice" element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                <CodingPractice />
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                <Projects />
              </ProtectedRoute>
            } />
            <Route path="/checkout/:courseId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/course/:courseId/lesson/:lessonId" element={<CoursePlayer />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute allowedRoles={['student', 'instructor']}>
                <Assignments />
              </ProtectedRoute>
            } />
            <Route path="/quizzes" element={
              <ProtectedRoute allowedRoles={['student', 'instructor']}>
                <Quizzes />
              </ProtectedRoute>
            } />
            <Route path="/quiz/:quizId/take" element={
              <ProtectedRoute allowedRoles={['student']}>
                <TakeQuiz />
              </ProtectedRoute>
            } />
            <Route path="/certificates" element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                <Certificates />
              </ProtectedRoute>
            } />
            <Route path="/certificate/:id" element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                <CertificateDetail />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute allowedRoles={['student', 'instructor']}>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/instructor/edit-course/:id" element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <EditCourse />
              </ProtectedRoute>
            } />
            <Route path="/instructor/create-course" element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <CreateCourse />
              </ProtectedRoute>
            } />
            <Route path="/instructor/dashboard" element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/instructor/quiz/create" element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <CreateQuiz />
              </ProtectedRoute>
            } />
            <Route path="/instructor/quiz/create/:courseId" element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <CreateQuiz />
              </ProtectedRoute>
            } />
            <Route path="/instructor/quiz/manage/:courseId" element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <ManageQuizzes />
              </ProtectedRoute>
            } />
            <Route path="/instructor/assignment/create" element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <CreateAssignment />
              </ProtectedRoute>
            } />
            <Route path="/instructor/assignment/create/:courseId" element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <CreateAssignment />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
          <AIChatWidget />
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
