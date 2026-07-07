import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Award, Download, Share2, ExternalLink } from 'lucide-react'

const Certificates = () => {
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const { data } = await axios.get('/api/certificates/my')
      setCertificates(data.certificates || [])
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
            <p className="text-gray-500 mt-1">Certificates earned from completed courses</p>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-16">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
            <p className="text-gray-500">Complete courses to earn certificates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert._id} onClick={() => navigate(`/certificate/${cert._id}`)} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white text-center">
                  <Award className="h-12 w-12 mx-auto mb-3" />
                  <h3 className="text-lg font-bold">Certificate</h3>
                  <p className="text-primary-100 text-sm mt-1">of Completion</p>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Student</p>
                  <p className="font-semibold text-gray-900 mt-1">{cert.studentName}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-3">Course</p>
                  <p className="font-semibold text-gray-900 mt-1">{cert.courseName || cert.course?.title}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-3">Issued</p>
                  <p className="text-sm text-gray-600 mt-1">{new Date(cert.issueDate).toLocaleDateString()}</p>
                  {cert.certificateId && (
                    <p className="text-xs text-gray-400 font-mono mt-2 truncate">ID: {cert.certificateId}</p>
                  )}
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 btn-primary py-2 text-sm flex items-center justify-center">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    <button className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Certificates
