import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FileText, Clock, CheckCircle, AlertCircle, BookOpen, ChevronRight } from 'lucide-react'

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const { data } = await axios.get('/api/assignments/my-assignments')
      console.log('Assignments API response:', data)
      setAssignments(data.assignments || [])
    } catch (error) {
      console.error('Error fetching assignments:', error.response?.status, error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-primary-100 mt-1">Track and submit your course assignments</p>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-500">Your instructors haven't posted any assignments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const isOverdue = assignment.deadline && new Date(assignment.deadline) < new Date() && !assignment.isSubmitted
              return (
                <div key={assignment._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                            {assignment.course?.title}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mt-1">{assignment.title}</h3>
                        {assignment.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{assignment.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                          {assignment.deadline && (
                            <span className={`flex items-center ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                              <Clock className="h-4 w-4 mr-1" />
                              {isOverdue ? 'Overdue: ' : 'Due: '}
                              {new Date(assignment.deadline).toLocaleDateString()}
                            </span>
                          )}
                          <span className="flex items-center text-gray-500">
                            <FileText className="h-4 w-4 mr-1" />
                            Max Score: {assignment.maxScore}
                          </span>
                          {assignment.isSubmitted && (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Submitted{assignment.grade ? ` (${assignment.grade}/${assignment.maxScore})` : ''}
                            </span>
                          )}
                          {!assignment.isSubmitted && !isOverdue && (
                            <span className="flex items-center text-amber-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Pending
                            </span>
                          )}
                          {isOverdue && (
                            <span className="flex items-center text-red-600 font-medium">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Assignments
