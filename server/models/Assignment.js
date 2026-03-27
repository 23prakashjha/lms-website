import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  maxScore: { type: Number, default: 100 },
  deadline: { type: Date },
  instructions: { type: String },
  allowedFileTypes: [{ type: String }],
  maxFileSize: { type: Number, default: 10485760 },
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    files: [{
      filename: String,
      url: String,
      type: String
    }],
    submittedAt: { type: Date, default: Date.now },
    grade: { type: Number },
    feedback: { type: String },
    isGraded: { type: Boolean, default: false }
  }]
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
