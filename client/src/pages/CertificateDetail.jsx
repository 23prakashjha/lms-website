import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Award, Download, Share2, ArrowLeft, CheckCircle, User, BookOpen, Calendar, Hash } from 'lucide-react'
import toast from 'react-hot-toast'

const CertificateDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificate()
  }, [id])

  const fetchCertificate = async () => {
    try {
      const { data } = await axios.get(`/api/certificates/${id}`)
      setCertificate(data.certificate)
    } catch (error) {
      toast.error('Failed to load certificate')
      navigate('/certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    toast.success('Certificate download started')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!certificate) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/certificates')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Certificates
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-900 p-8 sm:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
            </div>
            <div className="relative">
              <Award className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Certificate of Completion</h1>
              <p className="text-primary-200">This certifies that</p>
              <p className="text-2xl sm:text-3xl font-bold mt-4 text-white">{certificate.studentName}</p>
              <p className="text-primary-200 mt-4">has successfully completed the course</p>
              <p className="text-xl sm:text-2xl font-bold mt-2 text-white">{certificate.courseName}</p>
              {certificate.instructorName && (
                <p className="text-primary-200 mt-4 text-sm">
                  Instructed by {certificate.instructorName}
                </p>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Issue Date</p>
                  <p className="font-semibold text-gray-900">{new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              {certificate.completionDate && (
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Completion Date</p>
                    <p className="font-semibold text-gray-900">{new Date(certificate.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              )}
              {certificate.certificateId && (
                <div className="flex items-start space-x-3">
                  <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Certificate ID</p>
                    <p className="font-mono text-sm text-gray-900">{certificate.certificateId}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Student</p>
                  <p className="font-semibold text-gray-900">{certificate.studentName}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <BookOpen className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Course</p>
                  <p className="font-semibold text-gray-900">{certificate.courseName}</p>
                  {certificate.course?.slug && (
                    <Link to={`/courses/${certificate.course.slug}`} className="text-sm text-primary-600 hover:text-primary-700">
                      View Course
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {certificate.isVerified && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-700">
                  This certificate is verified and authentic.
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button onClick={handleDownload} className="flex-1 btn-primary py-3 flex items-center justify-center">
                <Download className="h-5 w-5 mr-2" />
                Download Certificate
              </button>
              <button onClick={handleShare} className="flex-1 btn-secondary py-3 flex items-center justify-center">
                <Share2 className="h-5 w-5 mr-2" />
                Share Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificateDetail