import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, Clock, Award, BookOpen, Play } from 'lucide-react'

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sampleQuizzes = [
      {
        _id: '1',
        title: 'JavaScript Fundamentals Quiz',
        description: 'Test your knowledge of JavaScript basics',
        course: { title: 'Web Development Bootcamp' },
        questions: [{ _id: '1' }, { _id: '2' }, { _id: '3' }],
        timeLimit: 15,
        passingScore: 70
      },
      {
        _id: '2',
        title: 'Python Basics Assessment',
        description: 'Quiz covering Python fundamentals',
        course: { title: 'Python for Data Science' },
        questions: [{ _id: '1' }, { _id: '2' }, { _id: '3' }, { _id: '4' }, { _id: '5' }],
        timeLimit: 30,
        passingScore: 60
      },
      {
        _id: '3',
        title: 'React Component Quiz',
        description: 'Test your understanding of React components',
        course: { title: 'React Masterclass' },
        questions: [{ _id: '1' }, { _id: '2' }],
        timeLimit: 10,
        passingScore: 80
      }
    ]
    
    setQuizzes(sampleQuizzes)
    setLoading(false)
  }, [])

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quizzes</h1>
          <p className="text-xl text-gray-600">Test your knowledge and earn certificates</p>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No quizzes available</p>
            <p className="text-gray-400 mt-2">Enroll in courses to access quizzes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <HelpCircle className="h-6 w-6 text-primary-600" />
                    </div>
                    <span className="ml-auto px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">
                      Available
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {quiz.description || 'No description'}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {quiz.course?.title}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {quiz.questions?.length || 0} Questions
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
                    </div>
                  </div>

                  <div className="flex items-center text-sm mb-4">
                    <Award className="h-4 w-4 mr-2 text-primary-600" />
                    <span className="text-gray-600">Passing Score: </span>
                    <span className="font-medium text-gray-900 ml-1">{quiz.passingScore}%</span>
                  </div>

                  <Link
                    to={`/quiz/${quiz._id}/take`}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Quiz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Quizzes
