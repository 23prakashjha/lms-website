import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoUrl: { type: String },
  videoDuration: { type: Number, default: 0 },
  content: { type: String },
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['pdf', 'doc', 'link', 'file'] }
  }],
  order: { type: Number, default: 0 },
  isPreview: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

lessonSchema.index({ course: 1, order: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
