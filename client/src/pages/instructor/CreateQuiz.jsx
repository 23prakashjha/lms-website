import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, Save, ArrowLeft, ArrowRight, HelpCircle, CheckCircle, X, BookOpen } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const CreateQuiz = () => {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || '')
  const [courseName, setCourseName] = useState('')
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    timeLimit: '',
    maxAttempts: 3,
    passingScore: 70,
    questions: [
      {
        question: '',
        type: 'multiple-choice',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        correctAnswer: '',
        points: 1
      }
    ]
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourseId) {
      const selectedCourse = courses.find(c => c._id === selectedCourseId)
      setCourseName(selectedCourse?.title || '')
    }
  }, [selectedCourseId, courses])

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/api/courses/my-courses')
      setCourses(data.courses || [])
      if (courseId) {
        setSelectedCourseId(courseId)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' }
  ]

  const handleChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value })
  }

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...quiz.questions]
    newQuestions[index][field] = value
    setQuiz({ ...quiz, questions: newQuestions })
  }

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...quiz.questions]
    newQuestions[questionIndex].options[optionIndex].text = value
    setQuiz({ ...quiz, questions: newQuestions })
  }

  const handleCorrectAnswer = (questionIndex, optionIndex) => {
    const newQuestions = [...quiz.questions]
    newQuestions[questionIndex].options.forEach((opt, i) => {
      opt.isCorrect = i === optionIndex
    })
    newQuestions[questionIndex].correctAnswer = optionIndex.toString()
    setQuiz({ ...quiz, questions: newQuestions })
  }

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          question: '',
          type: 'multiple-choice',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
          correctAnswer: '',
          points: 1
        }
      ]
    })
  }

  const removeQuestion = (index) => {
    if (quiz.questions.length === 1) {
      toast.error('At least one question is required')
      return
    }
    const newQuestions = quiz.questions.filter((_, i) => i !== index)
    setQuiz({ ...quiz, questions: newQuestions })
  }

  const addOption = (questionIndex) => {
    const newQuestions = [...quiz.questions]
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false })
    setQuiz({ ...quiz, questions: newQuestions })
  }

  const removeOption = (questionIndex, optionIndex) => {
    if (quiz.questions[questionIndex].options.length <= 2) {
      toast.error('At least two options are required')
      return
    }
    const newQuestions = [...quiz.questions]
    newQuestions[questionIndex].options.splice(optionIndex, 1)
    setQuiz({ ...quiz, questions: newQuestions })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCourseId) {
      toast.error('Please select a course first')
      return
    }

    if (!quiz.title) {
      toast.error('Quiz title is required')
      return
    }

    const emptyQuestions = quiz.questions.filter(q => !q.question.trim())
    if (emptyQuestions.length > 0) {
      toast.error('All questions must have text')
      return
    }

    setLoading(true)
    try {
      const quizData = {
        ...quiz,
        course: selectedCourseId,
        timeLimit: quiz.timeLimit ? parseInt(quiz.timeLimit) : null,
        maxAttempts: parseInt(quiz.maxAttempts),
        passingScore: parseInt(quiz.passingScore)
      }

      await axios.post('/api/quizzes', quizData)
      toast.success('Quiz created successfully!')
      navigate('/instructor/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create quiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/instructor/dashboard')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Quiz</h1>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">Please create a course first before adding quizzes.</p>
            <button
              onClick={() => navigate('/instructor/create-course')}
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Course
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Select Course</h2>
              </div>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="input-field w-full"
              >
                <option value="">-- Select a course --</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title} {course.isPublished ? '(Published)' : '(Draft)'}
                  </option>
                ))}
              </select>
            </div>

            {selectedCourseId && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Quiz Details
                    <span className="ml-2 text-sm font-normal text-green-600">
                      for: {courseName}
                    </span>
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quiz Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={quiz.title}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. JavaScript Fundamentals Quiz"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={quiz.description}
                        onChange={handleChange}
                        rows={3}
                        className="input-field"
                        placeholder="Brief description of the quiz..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time Limit (minutes)
                        </label>
                        <input
                          type="number"
                          name="timeLimit"
                          value={quiz.timeLimit}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="30"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Attempts
                        </label>
                        <input
                          type="number"
                          name="maxAttempts"
                          value={quiz.maxAttempts}
                          onChange={handleChange}
                          className="input-field"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Passing Score (%)
                        </label>
                        <input
                          type="number"
                          name="passingScore"
                          value={quiz.passingScore}
                          onChange={handleChange}
                          className="input-field"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Question
                    </button>
                  </div>

                  <div className="space-y-8">
                    {quiz.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                              {questionIndex + 1}
                            </span>
                            <span className="text-sm text-gray-500">Question</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeQuestion(questionIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Question Text *
                            </label>
                            <textarea
                              value={question.question}
                              onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                              rows={2}
                              className="input-field"
                              placeholder="Enter your question..."
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Question Type
                            </label>
                            <select
                              value={question.type}
                              onChange={(e) => handleQuestionChange(questionIndex, 'type', e.target.value)}
                              className="input-field"
                            >
                              {questionTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {question.type === 'multiple-choice' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Options (Select the correct answer)
                              </label>
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center space-x-3">
                                    <button
                                      type="button"
                                      onClick={() => handleCorrectAnswer(questionIndex, optionIndex)}
                                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        option.isCorrect
                                          ? 'bg-green-500 border-green-500'
                                          : 'border-gray-300 hover:border-primary-500'
                                      }`}
                                    >
                                      {option.isCorrect && <CheckCircle className="h-4 w-4 text-white" />}
                                    </button>
                                    <input
                                      type="text"
                                      value={option.text}
                                      onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                                      className="input-field flex-1"
                                      placeholder={`Option ${optionIndex + 1}`}
                                    />
                                    {question.options.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={() => removeOption(questionIndex, optionIndex)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <X className="h-5 w-5" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addOption(questionIndex)}
                                  className="flex items-center text-primary-600 hover:text-primary-700 text-sm"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Option
                                </button>
                              </div>
                            </div>
                          )}

                          {question.type === 'true-false' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correct Answer
                              </label>
                              <div className="flex space-x-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newQuestions = [...quiz.questions]
                                    newQuestions[questionIndex].correctAnswer = 'true'
                                    newQuestions[questionIndex].options = [
                                      { text: 'True', isCorrect: true },
                                      { text: 'False', isCorrect: false }
                                    ]
                                    setQuiz({ ...quiz, questions: newQuestions })
                                  }}
                                  className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                                    question.correctAnswer === 'true'
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-gray-300 hover:border-primary-500'
                                  }`}
                                >
                                  True
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newQuestions = [...quiz.questions]
                                    newQuestions[questionIndex].correctAnswer = 'false'
                                    newQuestions[questionIndex].options = [
                                      { text: 'True', isCorrect: false },
                                      { text: 'False', isCorrect: true }
                                    ]
                                    setQuiz({ ...quiz, questions: newQuestions })
                                  }}
                                  className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                                    question.correctAnswer === 'false'
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-gray-300 hover:border-primary-500'
                                  }`}
                                >
                                  False
                                </button>
                              </div>
                            </div>
                          )}

                          {question.type === 'short-answer' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Correct Answer
                              </label>
                              <input
                                type="text"
                                value={question.correctAnswer}
                                onChange={(e) => handleQuestionChange(questionIndex, 'correctAnswer', e.target.value)}
                                className="input-field"
                                placeholder="Enter the correct answer"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Points
                            </label>
                            <input
                              type="number"
                              value={question.points}
                              onChange={(e) => handleQuestionChange(questionIndex, 'points', parseInt(e.target.value) || 1)}
                              className="input-field w-24"
                              min="1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/instructor/dashboard')}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center disabled:opacity-50"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {loading ? 'Creating...' : 'Create Quiz'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CreateQuiz
