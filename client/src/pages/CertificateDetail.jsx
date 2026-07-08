import { useState, useEffect, useRef, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Award, Download, Share2, ArrowLeft, CheckCircle, User, BookOpen, Calendar, Hash, Shield, Code, Clock, BarChart, Star, Trophy, Info, Edit, Trash2, ShieldAlert, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthContext from '../context/AuthContext'
import ReviewForm from '../components/ReviewForm'

const CertificateDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [userReview, setUserReview] = useState(null)
  const isAdmin = user?.role === 'admin'
  const certRef = useRef(null)

  useEffect(() => {
    fetchCertificate()
  }, [id, user])

  const fetchCertificate = async () => {
    try {
      const { data } = await axios.get(`/api/certificates/${id}`)
      setCertificate(data.certificate)

      if (data.certificate?.course?._id) {
        const courseId = data.certificate.course._id
        const { data: courseData } = await axios.get(`/api/courses/${courseId}`)
        setReviews(courseData.reviews || [])
        if (user) {
          try {
            const { data: myReview } = await axios.get(`/api/courses/${courseId}/reviews/mine`)
            setUserReview(myReview.review || null)
          } catch { /* ignore */ }
        }
      }
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

  const handleReviewSubmitted = async () => {
    if (!certificate?.course?._id) return
    const courseId = certificate.course._id
    const { data: courseData } = await axios.get(`/api/courses/${courseId}`)
    setReviews(courseData.reviews || [])
    try {
      const { data: myReview } = await axios.get(`/api/courses/${courseId}/reviews/mine`)
      setUserReview(myReview.review || null)
    } catch { /* ignore */ }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this certificate? This cannot be undone.')) return
    try {
      await axios.delete(`/api/certificates/${id}`)
      toast.success('Certificate deleted')
      navigate('/certificates')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete certificate')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!certificate) return null

  const organizationName = 'PrakashEdu'
  const issueDate = new Date(certificate.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const completionDate = certificate.completionDate
    ? new Date(certificate.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null
  const skills = certificate.skills || []
  const technologies = certificate.technologies || []
  const accreditation = certificate.accreditation || {}
  const isOwner = user && certificate.user?._id === user._id
  const hasCourse = !!certificate.course?._id

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/certificates')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Certificates
        </button>

        <div ref={certRef} className="bg-white rounded-2xl shadow-xl overflow-hidden border-8 border-gray-200">
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-900 px-8 sm:px-12 py-6 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
            </div>
            <div className="relative flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <Award className="h-8 w-8 text-yellow-300" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold">{organizationName}</p>
                  <p className="text-xs text-primary-200">Learning Platform</p>
                  {accreditation.isoCertified && (
                    <p className="text-xs text-primary-200 flex items-center mt-1"><Shield className="h-3 w-3 mr-1" />ISO Certified</p>
                  )}
                  {accreditation.industryPartner && (
                    <p className="text-xs text-primary-200">Partner: {accreditation.industryPartner}</p>
                  )}
                </div>
              </div>
              {certificate.isVerified && (
                <div className="flex items-center space-x-1 bg-green-500 bg-opacity-20 px-3 py-1 rounded-full text-sm mt-3 sm:mt-0">
                  <CheckCircle className="h-4 w-4" />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 sm:p-12 lg:p-16">
            <div className="text-center mb-10">
              <Award className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{certificate.certificateTitle || 'Certificate of Completion'}</h1>
              <div className="w-24 h-1 bg-primary-600 mx-auto my-4"></div>
              <p className="text-gray-500 text-lg">This certificate is proudly presented to</p>
              <div className="flex items-center justify-center space-x-3 mt-4">
                {certificate.studentPhoto && (
                  <img src={certificate.studentPhoto} alt="" className="h-16 w-16 rounded-full object-cover border-2 border-primary-200" />
                )}
                <p className="text-3xl sm:text-4xl font-bold text-primary-700">{certificate.studentName}</p>
              </div>
              {certificate.studentId && (
                <p className="text-sm text-gray-400 mt-1">Student ID: {certificate.studentId}</p>
              )}
            </div>

            {certificate.description ? (
              <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                {certificate.description}
              </p>
            ) : (
              <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                For successfully completing the course <strong>{certificate.courseName}</strong>
                {certificate.instructorName && <> under the instruction of <strong>{certificate.instructorName}</strong></>}
                {certificate.courseLevel && <> at the <strong>{certificate.courseLevel}</strong> level</>}
                .
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                <BookOpen className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Course</p>
                  <p className="font-semibold text-gray-900">{certificate.courseName}</p>
                  {certificate.course?.slug && (
                    <Link to={`/courses/${certificate.course.slug}`} className="text-sm text-primary-600 hover:text-primary-700">View Course</Link>
                  )}
                </div>
              </div>
              {certificate.courseLevel && (
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <BarChart className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Level</p>
                    <p className="font-semibold text-gray-900 capitalize">{certificate.courseLevel}</p>
                  </div>
                </div>
              )}
              {certificate.totalHours > 0 && (
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Clock className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Duration</p>
                    <p className="font-semibold text-gray-900">{certificate.totalHours} hours{certificate.courseDuration ? ` (${certificate.courseDuration})` : ''}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                <Calendar className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Issue Date</p>
                  <p className="font-semibold text-gray-900">{issueDate}</p>
                </div>
              </div>
              {completionDate && (
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Completion Date</p>
                    <p className="font-semibold text-gray-900">{completionDate}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Certificate ID</p>
                  <p className="font-mono text-sm text-gray-900 break-all">{certificate.certificateId}</p>
                </div>
              </div>
            </div>

            {(certificate.percentage > 0 || certificate.grade || certificate.quizScore > 0 || certificate.projectScore > 0) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                  Performance
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {certificate.percentage > 0 && (
                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                      <p className="text-2xl font-bold text-green-600">{certificate.percentage}%</p>
                      <p className="text-xs text-gray-500 mt-1">Overall</p>
                    </div>
                  )}
                  {certificate.grade && (
                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-2xl font-bold text-blue-600">{certificate.grade}</p>
                      <p className="text-xs text-gray-500 mt-1">Grade</p>
                    </div>
                  )}
                  {certificate.quizScore > 0 && (
                    <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <p className="text-2xl font-bold text-purple-600">{certificate.quizScore}</p>
                      <p className="text-xs text-gray-500 mt-1">Quiz Score</p>
                    </div>
                  )}
                  {certificate.projectScore > 0 && (
                    <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <p className="text-2xl font-bold text-orange-600">{certificate.projectScore}</p>
                      <p className="text-xs text-gray-500 mt-1">Project Score</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(technologies.length > 0 || skills.length > 0) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Code className="h-5 w-5 text-primary-600 mr-2" />
                  {skills.length > 0 ? 'Skills & Technologies' : 'Technologies'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={`skill-${i}`} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium border border-primary-100">
                      {skill}
                    </span>
                  ))}
                  {technologies.filter(t => !skills.includes(t)).map((tech, i) => (
                    <span key={`tech-${i}`} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 pt-8 border-t border-gray-200">
              <div className="space-y-6">
                {certificate.instructorName && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Instructor</p>
                    <div className="flex items-center space-x-3">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-semibold text-gray-900">{certificate.instructorName}</p>
                        {certificate.instructorSignature && (
                          <img src={certificate.instructorSignature} alt="Instructor Signature" className="h-8 mt-1 object-contain" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {certificate.directorName && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Director</p>
                    <div className="flex items-center space-x-3">
                      <User className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-semibold text-gray-900">{certificate.directorName}</p>
                        {certificate.directorSignature && (
                          <img src={certificate.directorSignature} alt="Director Signature" className="h-8 mt-1 object-contain" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {certificate.officialStamp && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Official Stamp</p>
                    <img src={certificate.officialStamp} alt="Official Stamp" className="h-16 object-contain" />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {certificate.qrCode && (
                  <div className="text-center sm:text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">Verify Certificate</p>
                    <img src={certificate.qrCode} alt="QR Code" className="h-24 w-24 mx-auto sm:ml-auto object-contain" />
                  </div>
                )}
                {certificate.verificationUrl && (
                  <div className="text-center sm:text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Verification URL</p>
                    <a href={certificate.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 break-all">
                      {certificate.verificationUrl}
                    </a>
                  </div>
                )}
                <div className="text-center sm:text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Verify Online</p>
                  <Link to={`/verify/${certificate.certificateId}`} className="text-sm text-primary-600 hover:text-primary-700">
                    Verify this certificate <Info className="h-3 w-3 inline" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button onClick={handleDownload} className="flex-1 btn-primary py-3 flex items-center justify-center">
            <Download className="h-5 w-5 mr-2" />
            Download Certificate
          </button>
          <button onClick={handleShare} className="flex-1 btn-secondary py-3 flex items-center justify-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share Certificate
          </button>
        </div>

        {isAdmin && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700">Admin Actions</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => navigate('/admin/dashboard')} className="px-3 py-1.5 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center">
                <Edit className="h-4 w-4 mr-1" />Edit in Admin
              </button>
              <button onClick={handleDelete} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center">
                <Trash2 className="h-4 w-4 mr-1" />Delete
              </button>
            </div>
          </div>
        )}

        {hasCourse && (
          <div className="mt-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <MessageSquare className="h-6 w-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900">Course Reviews</h2>
              </div>

              {isOwner && (
                <div className="mb-8">
                  <ReviewForm
                    courseId={certificate.course._id}
                    existingReview={userReview}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </div>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-5 bg-gray-50 rounded-xl">
                      <div className="flex items-start gap-4">
                        <img
                          src={review.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'User')}&background=6366f1&color=fff`}
                          alt={review.user?.name}
                          className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-1">
                            <p className="font-semibold text-gray-900">{review.user?.name}</p>
                            <span className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          {review.comment && (
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No reviews yet for this course.</p>
                  {isOwner && (
                    <p className="text-gray-400 text-sm mt-1">Be the first to share your experience!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CertificateDetail
