import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{
    question: { type: String, required: true },
    type: { type: String, enum: ['multiple-choice', 'true-false', 'short-answer'], required: true },
    options: [{
      text: String,
      isCorrect: Boolean
    }],
    correctAnswer: String,
    points: { type: Number, default: 1 }
  }],
  timeLimit: { type: Number },
  maxAttempts: { type: Number, default: 3 },
  passingScore: { type: Number, default: 70 },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
