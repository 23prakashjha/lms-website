import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const TakeQuiz = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    if (quiz?.timeLimit && !submitted) {
      setTimeLeft(quiz.timeLimit * 60)
    }
  }, [quiz, submitted])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, submitted])

  const fetchQuiz = async () => {
    try {
      const { data } = await axios.get(`/api/quizzes/${quizId}`)
      setQuiz(data.quiz)
    } catch (error) {
      toast.error('Failed to load quiz')
      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer })
  }

  const handleSubmit = async () => {
    if (submitted) return

    setSubmitted(true)

    try {
      const formattedAnswers = quiz.questions.map((q, index) => ({
        questionIndex: index,
        answer: answers[index]
      }))

      const { data } = await axios.post(`/api/quizzes/${quizId}/attempt`, {
        answers: quiz.questions.map((q, i) => answers[i])
      })

      setResult(data)
    } catch (error) {
      toast.error('Failed to submit quiz')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Quiz not found</p>
      </div>
    )
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              result.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {result.passed ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <AlertCircle className="h-12 w-12 text-red-600" />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">
              {result.passed ? 'Congratulations!' : 'Keep Trying!'}
            </h1>

            <p className="text-gray-600 mb-8">
              {result.passed
                ? 'You passed the quiz!'
                : 'You did not pass this time, but you can try again.'}
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="text-6xl font-bold text-primary-600 mb-2">
                {Math.round(result.score)}%
              </div>
              <p className="text-gray-600">
                Passing Score: {quiz.passingScore}%
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Back to Course
              </button>
              {!result.passed && (
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setAnswers({})
                    setCurrentQuestion(0)
                    setResult(null)
                  }}
                  className="btn-primary"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            {timeLeft !== null && (
              <div className={`flex items-center px-4 py-2 rounded-lg ${
                timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          {question.type === 'multiple-choice' && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    answers[currentQuestion] === index
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <span className="flex items-center">
                    <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 ${
                      answers[currentQuestion] === index
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          )}

          {question.type === 'true-false' && (
            <div className="grid grid-cols-2 gap-4">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, question.options[index].text)}
                  className={`p-6 rounded-xl border-2 text-lg font-medium transition-all ${
                    answers[currentQuestion] === question.options[index].text
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {question.options[index].text}
                </button>
              ))}
            </div>
          )}

          {question.type === 'short-answer' && (
            <input
              type="text"
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
              className="input-field text-lg"
              placeholder="Type your answer..."
            />
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="btn-secondary flex items-center disabled:opacity-50"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="btn-primary flex items-center bg-green-600 hover:bg-green-700"
            >
              Submit Quiz
              <CheckCircle className="h-5 w-5 ml-2" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              className="btn-primary flex items-center"
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>

        <div className="mt-8 flex justify-center space-x-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentQuestion
                  ? 'bg-primary-600 w-8'
                  : answers[index] !== undefined
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TakeQuiz
