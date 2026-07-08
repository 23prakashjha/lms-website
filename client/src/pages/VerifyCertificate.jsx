import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Award, CheckCircle, XCircle, Search, Shield } from 'lucide-react'

const VerifyCertificate = () => {
  const { certificateId } = useParams()
  const [inputId, setInputId] = useState(certificateId || '')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!inputId.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await axios.get(`/api/certificates/verify/${inputId.trim()}`)
      setResult(data)
    } catch (error) {
      setResult({ success: false, valid: false, message: 'Certificate not found' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Certificate Verification</h1>
          <p className="text-gray-500 mt-2">Verify the authenticity of a certificate</p>
        </div>

        <form onSubmit={handleVerify} className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Certificate ID</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="e.g. CERT-2026-0001"
              className="input-field flex-1"
            />
            <button type="submit" disabled={loading} className="btn-primary px-6">
              {loading ? 'Verifying...' : <Search className="h-5 w-5" />}
            </button>
          </div>
        </form>

        {searched && result && (
          <div className={`bg-white rounded-xl shadow-sm p-6 border-2 ${result.valid ? 'border-green-200' : 'border-red-200'}`}>
            {result.valid ? (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-2">Certificate Verified</h2>
                <p className="text-gray-500 mb-6">This is a valid and authentic certificate.</p>
                <div className="space-y-3 text-left bg-green-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Certificate ID</p>
                    <p className="font-mono text-sm font-semibold">{result.certificate.certificateId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Student Name</p>
                    <p className="font-semibold">{result.certificate.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Course</p>
                    <p className="font-semibold">{result.certificate.courseName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Issue Date</p>
                    <p className="font-semibold">{new Date(result.certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  {result.certificate.organizationName && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Organization</p>
                      <p className="font-semibold">{result.certificate.organizationName}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-600 mb-2">Certificate Not Found</h2>
                <p className="text-gray-500">No certificate found with this ID. Please check and try again.</p>
              </div>
            )}
          </div>
        )}

        {!searched && !certificateId && (
          <div className="text-center text-gray-400">
            <Award className="h-12 w-12 mx-auto mb-3" />
            <p>Enter a certificate ID above to verify its authenticity.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyCertificate
