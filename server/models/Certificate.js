import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
  certificateId: { type: String, unique: true },
  studentName: { type: String, required: true },
  courseName: { type: String, required: true },
  instructorName: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  certificateUrl: { type: String },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

certificateSchema.pre('save', async function (next) {
  if (!this.certificateId) {
    this.certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
