import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Mail, MapPin, Award, ArrowRight, Star, Users, Globe, ChevronRight, Briefcase, GraduationCap, Calendar, Building2 } from 'lucide-react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Instructors</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn from experienced professionals dedicated to helping you succeed.
          </p>
        </div>

        {instructors.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No instructors yet</h3>
            <p className="text-gray-600">Check back soon for our instructor listings.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <div key={instructor._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="bg-gradient-to-r from-primary-500 to-primary-700 h-24"></div>
                <div className="px-6 pb-6">
                  <div className="flex justify-center -mt-12 mb-4">
                    <img
                      src={instructor.avatar || `https://ui-avatars.com/api/?name=${instructor.name}&background=3b82f6&color=fff`}
                      alt={instructor.name}
                      className="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover"
                    />
                  </div>
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{instructor.email}</p>
                    {instructor.bio && (
                      <p className="text-gray-600 mt-3 text-sm line-clamp-2">{instructor.bio}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                    {instructor.highestQualification && (
                      <span className="flex items-center"><GraduationCap className="h-3.5 w-3.5 mr-1 text-primary-600" />{instructor.highestQualification}</span>
                    )}
                    {instructor.currentCompany && (
                      <span className="flex items-center"><Briefcase className="h-3.5 w-3.5 mr-1 text-primary-600" />{instructor.currentCompany}</span>
                    )}
                    {instructor.totalExperience > 0 && (
                      <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1 text-primary-600" />{instructor.totalExperience} yrs</span>
                    )}
                  </div>
                  {instructor.subjects?.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      {instructor.subjects.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                  {instructor.languages?.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      {instructor.languages.map((l, i) => (
                        <span key={i} className="flex items-center px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full"><Globe className="h-3 w-3 mr-1" />{l}</span>
                      ))}
                    </div>
                  )}
                  {instructor.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      {instructor.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{skill}</span>
                      ))}
                    </div>
                  )}
                  {instructor.experience?.length > 0 && (
                    <div className="text-left mb-3 px-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center"><Briefcase className="h-3 w-3 mr-1" />Experience</p>
                      <div className="space-y-1.5">
                        {instructor.experience.slice(0, 2).map((exp, i) => (
                          <div key={i} className="text-xs text-gray-600">
                            <span className="font-medium text-gray-800">{exp.position}</span> at {exp.company}
                            <span className="text-gray-400 ml-1">
                              ({exp.startDate && new Date(exp.startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                              {' - '}
                              {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''})
                            </span>
                          </div>
                        ))}
                        {instructor.experience.length > 2 && <p className="text-xs text-primary-600">+{instructor.experience.length - 2} more</p>}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-center text-sm text-gray-500 pt-2 border-t border-gray-100">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{instructor.createdCourses?.length || 0} courses</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!user && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Want to join our team of expert instructors?</p>
            <Link to="/register" className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              <span>Become an Instructor</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Instructor