import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'

const Checkout = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!courseId || !user) return
    loadRazorpay()
    return () => {
      document.body.style.overflow = ''
    }
  }, [courseId, user])

  const loadRazorpay = () => {
    if (window.Razorpay) {
      createOrder()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = createOrder
    script.onerror = () => {
      setStatus('error')
      setMessage('Failed to load payment gateway. Please try again.')
    }
    document.body.appendChild(script)
  }

  const createOrder = async () => {
    try {
      const { data } = await axios.post('/api/payments/create-order', { courseId })
      if (!data.success) throw new Error('Failed to create order')
      openRazorpay(data)
    } catch (err) {
      setStatus('error')
      setMessage(err.response?.data?.message || 'Failed to initiate payment')
    }
  }

  const openRazorpay = (data) => {
    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: data.order.currency,
      name: 'PrakashEdu',
      description: 'Course Enrollment',
      order_id: data.order.id,
      prefill: {
        name: user.name,
        email: user.email
      },
      theme: { color: '#7c3aed' },
      handler: async (response) => {
        setStatus('processing')
        try {
          await axios.post('/api/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
          setStatus('success')
          setMessage('Payment successful! You are now enrolled.')
          setTimeout(() => {
            document.body.style.overflow = ''
            navigate('/dashboard')
          }, 3000)
        } catch {
          setStatus('error')
          setMessage('Payment verification failed. Please contact support.')
        }
      },
      modal: {
        ondismiss: () => {
          setStatus('cancelled')
          setMessage('Payment cancelled.')
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      setStatus('error')
      setMessage(response.error.description || 'Payment failed. Please try again.')
    })
    rzp.open()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <div>
            <Loader className="h-16 w-16 text-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Preparing Payment...</h2>
            <p className="text-gray-500 mt-2">Please wait while we set up the payment gateway.</p>
          </div>
        )}

        {status === 'processing' && (
          <div>
            <Loader className="h-16 w-16 text-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Verifying Payment...</h2>
            <p className="text-gray-500 mt-2">Please do not close this page.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <p className="text-sm text-gray-400 mt-4">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Payment Failed</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <button onClick={() => { document.body.style.overflow = ''; navigate('/courses') }} className="btn-primary mt-6">
              Browse Courses
            </button>
          </div>
        )}

        {status === 'cancelled' && (
          <div>
            <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Payment Cancelled</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <button onClick={() => { document.body.style.overflow = ''; navigate(-1) }} className="btn-primary mt-6">
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkout
