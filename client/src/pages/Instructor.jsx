import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Mail, MapPin, Award, ArrowRight, Star, Users, Globe, ChevronRight, Briefcase, GraduationCap, Calendar, Building2, Sparkles, Shield, ChevronDown, ExternalLink } from 'lucide-react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'

const shimmer = (w = 'full', h = 4, rounded = 'lg', extra = '') => (
  <div className={`w-${w} h-${h} rounded-${rounded} bg-gray-200 relative overflow-hidden ${extra}`}>
    <div className="absolute inset-0 shimmer-bg" />
  </div>
)

const InstructorSkeleton = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300" />
    <div className="px-6 pb-6">
      <div className="flex justify-center -mt-12 mb-4">
        <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 relative overflow-hidden shadow-md">
          <div className="absolute inset-0 shimmer-bg" />
        </div>
      </div>
      <div className="text-center mb-4 space-y-2">
        {shimmer('3/5', 5, 'lg', 'mx-auto')}
        {shimmer('2/5', 3, 'md', 'mx-auto')}
        <div className="pt-2">
          {shimmer('full', 8, 'md', 'mx-auto')}
        </div>
      </div>
      <div className="flex justify-center gap-3 mb-4">
        {shimmer(16, 5, 'full')}
        {shimmer(20, 5, 'full')}
        {shimmer(12, 5, 'full')}
      </div>
      <div className="flex justify-center gap-2 mb-4">
        {shimmer(16, 6, 'full')}
        {shimmer(14, 6, 'full')}
        {shimmer(18, 6, 'full')}
      </div>
      <div className="flex justify-center pt-2 border-t border-gray-100">
        {shimmer(24, 4, 'md')}
      </div>
    </div>
  </div>
)

const Instructor = () => {
  const { user } = useContext(AuthContext)
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin'
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      const { data } = await axios.get('/api/users/instructors')
      setInstructors(data.users || [])
    } catch (error) {
      console.error('Error fetching instructors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 py-20 mb-12">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 h-80 w-80 bg-primary-400/20 rounded-full blur-3xl animate-blob" />
            <div className="absolute -bottom-40 -right-40 h-80 w-80 bg-accent-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-primary-300/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-10 w-64 bg-white/10 rounded-xl mx-auto mb-4 relative overflow-hidden">
              <div className="absolute inset-0 shimmer-bg" />
            </div>
            <div className="h-6 w-96 bg-white/10 rounded-lg mx-auto relative overflow-hidden">
              <div className="absolute inset-0 shimmer-bg" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <InstructorSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ────────────── Hero ────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-80 w-80 bg-primary-400/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -right-40 h-80 w-80 bg-accent-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-primary-300/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-6 border border-white/10">
              <Sparkles className="h-4 w-4 text-accent-300" />
              Learn from the best
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Our{' '}
              <span className="bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent">
                Expert Instructors
              </span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100/80 max-w-2xl mx-auto leading-relaxed">
              Learn from experienced professionals dedicated to helping you succeed.
              Each instructor brings real-world expertise to every lesson.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-primary-200/70 text-sm">
              <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-accent-300" /> Verified Experts</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-accent-300" /> Top Rated</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-accent-300" /> 10k+ Students</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* ────────────── Content ────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {instructors.length === 0 ? (
          <div className="glass-card py-20 px-8 text-center animate-scale-in">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 mb-6">
              <Users className="h-10 w-10 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No instructors yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We're currently onboarding expert instructors. Check back soon for our instructor listings.
            </p>
            {!user && (
              <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Get Notified
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <div
                key={instructor._id}
                className="card card-hover overflow-hidden group animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient header */}
                <div className="relative h-24 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  <div className="absolute -top-6 -right-6 h-20 w-20 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute -bottom-6 -left-6 h-16 w-16 bg-white/10 rounded-full blur-xl" />
                </div>

                {/* Avatar */}
                <div className="px-6 pb-6">
                  <div className="flex justify-center -mt-12 mb-4 relative z-10">
                    <div className="relative">
                      <img
                        src={instructor.avatar || `https://ui-avatars.com/api/?name=${instructor.name}&background=3b82f6&color=fff`}
                        alt={instructor.name}
                        className="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-400 border-2 border-white rounded-full" />
                    </div>
                  </div>

                  {/* Name & bio */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {instructor.name}
                    </h3>
                    <p className="text-gray-400 text-xs flex items-center justify-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3" />
                      {instructor.email}
                    </p>
                    {instructor.bio && (
                      <p className="text-gray-500 mt-3 text-sm leading-relaxed line-clamp-2">{instructor.bio}</p>
                    )}
                  </div>

                  {/* Experience & Qualification row */}
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-gray-500 mb-4">
                    {instructor.highestQualification && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-primary-50 to-accent-50 rounded-full text-primary-700 font-medium">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {instructor.highestQualification}
                      </span>
                    )}
                    {instructor.currentCompany && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-full text-gray-600">
                        <Building2 className="h-3.5 w-3.5 text-gray-400" />
                        {instructor.currentCompany}
                      </span>
                    )}
                    {instructor.totalExperience > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-full text-gray-600">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {instructor.totalExperience}+ yrs
                      </span>
                    )}
                  </div>

                  {/* Subjects */}
                  {instructor.subjects?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                      {instructor.subjects.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full border border-primary-100">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Languages */}
                  {instructor.languages?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                      {instructor.languages.map((l, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full border border-green-100">
                          <Globe className="h-3 w-3" />
                          {l}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {instructor.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                      {instructor.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Experience timeline */}
                  {instructor.experience?.length > 0 && (
                    <div className="mb-4 px-1">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          Experience
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
                      </div>
                      <div className="space-y-2">
                        {instructor.experience.slice(0, 2).map((exp, i) => (
                          <div key={i} className="relative pl-4 border-l-2 border-primary-200">
                            <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-primary-400 border-2 border-white" />
                            <p className="text-xs font-semibold text-gray-800 leading-tight">{exp.position}</p>
                            <p className="text-[11px] text-gray-500">{exp.company}</p>
                            {(exp.startDate || exp.endDate) && (
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {exp.startDate && new Date(exp.startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                {' — '}
                                {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
                              </p>
                            )}
                          </div>
                        ))}
                        {instructor.experience.length > 2 && (
                          <button
                            onClick={() => {}}
                            className="text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors flex items-center gap-1 ml-4"
                          >
                            +{instructor.experience.length - 2} more <ChevronDown className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* course count footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <BookOpen className="h-3.5 w-3.5 text-primary-500" />
                      <span className="font-medium text-gray-700">{instructor.createdCourses?.length || 0}</span>
                      <span>courses</span>
                    </div>
                    <span className="text-xs text-primary-600 font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Profile <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ────────────── CTA ────────────── */}
        {!user && (
          <div className="relative mt-16 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-accent-900" />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 h-60 w-60 bg-accent-400/20 rounded-full blur-3xl animate-blob" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 bg-primary-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            </div>
            <div className="relative px-8 py-14 md:py-16 md:px-16 text-center">
              <div className="max-w-2xl mx-auto animate-fade-up">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-white/10">
                  <Shield className="h-7 w-7 text-accent-300" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Want to join our team of{' '}
                  <span className="bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent">
                    expert instructors
                  </span>
                  ?
                </h2>
                <p className="text-primary-100/70 text-lg mb-8 max-w-lg mx-auto">
                  Share your knowledge with thousands of eager learners around the world.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2.5 bg-white text-primary-700 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-primary-50 transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 group"
                >
                  <span>Become an Instructor</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Instructor
