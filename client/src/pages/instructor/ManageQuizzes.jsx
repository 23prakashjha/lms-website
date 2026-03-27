import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, HelpCircle, Users, Clock } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ManageQuizzes = () => {
  const { courseId } = useParams()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [courseId])

  const fetchQuizzes = async () => {
    try {
      const { data } = await axios.get(`/api/quizzes/course/${courseId}`)
      setQuizzes(data.quizzes || [])
    } catch (error) {
      console.error('Error fetching quizzes:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteQuiz = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return

    try {
      await axios.delete(`/api/quizzes/${quizId}`)
      toast.success('Quiz deleted successfully')
      fetchQuizzes()
    } catch (error) {
      toast.error('Failed to delete quiz')
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Quizzes</h1>
            <p className="mt-2 text-gray-600">Create and manage quizzes for your course</p>
          </div>
          <Link
            to={`/instructor/quiz/create/${courseId}`}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Quiz
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h3>
            <p className="text-gray-600 mb-6">Create your first quiz to test student knowledge</p>
            <Link to={`/instructor/quiz/create/${courseId}`} className="btn-primary inline-flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create Quiz
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <HelpCircle className="h-6 w-6 text-primary-600" />
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      quiz.isPublished
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {quiz.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {quiz.description || 'No description'}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      {quiz.questions?.length || 0} questions
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm">
                      <span className="text-gray-500">Passing: </span>
                      <span className="font-medium text-gray-900">{quiz.passingScore}%</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteQuiz(quiz._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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

export default ManageQuizzes
