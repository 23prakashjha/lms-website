import { useState, useEffect } from 'react'
import axios from 'axios'
import { Award, Download, Share2 } from 'lucide-react'

const Certificates = () => {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const { data } = await axios.get('/api/enrollments/my-enrollments')
      const completed = data.enrollments.filter(e => e.isCompleted && e.certificateId)
      setCertificates(completed)
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Certificates</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Complete courses to earn certificates</p>
            </div>
          ) : (
            certificates.map((cert) => (
              <div key={cert._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
                  <Award className="h-16 w-16 mb-4" />
                  <h3 className="text-xl font-semibold">Certificate of Completion</h3>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900">{cert.course?.title}</h4>
                  <p className="text-sm text-gray-500 mt-2">
                    Issued: {new Date(cert.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <button className="btn-primary py-2 px-4 text-sm flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    <button className="btn-secondary py-2 px-4 text-sm flex items-center">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Certificates
