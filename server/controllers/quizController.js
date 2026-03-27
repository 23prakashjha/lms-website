import Quiz from '../models/Quiz.js'
import Enrollment from '../models/Enrollment.js'

export const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create({
      ...req.body,
      instructor: req.user.id
    })
    res.status(201).json({ success: true, quiz })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCourseQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId })
      .populate('instructor', 'name avatar')
    res.json({ success: true, quizzes })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('instructor', 'name avatar')
    
    if (!quiz.isPublished && quiz.instructor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Quiz not available' })
    }

    res.json({ success: true, quiz })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const attemptQuiz = async (req, res) => {
  try {
    const { answers } = req.body
    const quiz = await Quiz.findById(req.params.id)

    let score = 0
    let totalPoints = 0

    quiz.questions.forEach((question, index) => {
      totalPoints += question.points
      
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        const userAnswer = answers[index]
        const correctOption = question.options.findIndex(o => o.isCorrect)
        if (userAnswer === correctOption) {
          score += question.points
        }
      } else if (question.type === 'short-answer') {
        if (answers[index]?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim()) {
          score += question.points
        }
      }
    })

    const percentage = (score / totalPoints) * 100
    const passed = percentage >= quiz.passingScore

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: quiz.course
    })

    const existingAttempt = enrollment.quizAttempts.find(
      a => a.quiz.toString() === quiz._id.toString()
    )

    if (existingAttempt) {
      existingAttempt.score = percentage
      existingAttempt.attempts += 1
      existingAttempt.completedAt = new Date()
    } else {
      enrollment.quizAttempts.push({
        quiz: quiz._id,
        score: percentage,
        attempts: 1,
        completedAt: new Date()
      })
    }

    await enrollment.save()

    res.json({
      success: true,
      score: percentage,
      passed,
      correctAnswers: quiz.questions.map(q => ({
        type: q.type,
        correctAnswer: q.type === 'short-answer' ? q.correctAnswer : q.options.findIndex(o => o.isCorrect)
      }))
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Quiz deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
