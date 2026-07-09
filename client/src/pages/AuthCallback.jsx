import { useEffect, useState, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BookOpen, XCircle } from 'lucide-react'
import AuthContext from '../context/AuthContext'

const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { setUserFromToken } = useContext(AuthContext)

  useEffect(() => {
    const token = searchParams.get('token')
    const errorMsg = searchParams.get('error')

    if (errorMsg) {
      setError(errorMsg)
      return
    }

    if (!token) {
      setError('Authentication failed. No token received.')
      return
    }

    setUserFromToken(token)
      .then((data) => {
        const role = data.user.role
        if (role === 'admin') navigate('/admin/dashboard', { replace: true })
        else if (role === 'instructor') navigate('/instructor/dashboard', { replace: true })
        else navigate('/dashboard', { replace: true })
      })
      .catch(() => {
        localStorage.removeItem('token')
        setError('Failed to verify your account. Please try again.')
      })
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Authentication Failed</h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <button onClick={() => navigate('/login')} className="btn-primary mt-6">
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto h-16 w-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
          <BookOpen className="absolute inset-0 h-8 w-8 m-auto text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Signing you in...</h2>
        <p className="text-gray-500 mt-2">Please wait while we complete the authentication.</p>
      </div>
    </div>
  )
}

export default AuthCallback
