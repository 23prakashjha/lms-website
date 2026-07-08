import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' },
  certificateId: { type: String, unique: true },

  certificateTitle: { type: String, enum: ['Certificate of Completion', 'Certificate of Achievement', 'Certificate of Excellence'], default: 'Certificate of Completion' },
  organizationName: { type: String, default: 'PrakashEdu' },
  logo: { type: String, default: '' },

  studentName: { type: String, required: true },
  studentId: { type: String, default: '' },
  studentPhoto: { type: String, default: '' },

  courseName: { type: String, required: true },
  courseLevel: { type: String, default: '' },
  courseDuration: { type: String, default: '' },
  totalHours: { type: Number, default: 0 },
  technologies: [{ type: String }],

  issueDate: { type: Date, default: Date.now },
  completionDate: { type: Date },

  grade: { type: String, default: '' },
  percentage: { type: Number, default: 0 },
  quizScore: { type: Number, default: 0 },
  projectScore: { type: Number, default: 0 },

  instructorName: { type: String, default: '' },
  instructorSignature: { type: String, default: '' },

  directorName: { type: String, default: '' },
  directorSignature: { type: String, default: '' },
  officialStamp: { type: String, default: '' },

  description: { type: String, default: '' },

  qrCode: { type: String, default: '' },
  verificationUrl: { type: String, default: '' },

  skills: [{ type: String }],

  accreditation: {
    isoCertified: { type: Boolean, default: false },
    industryPartner: { type: String, default: '' }
  },

  certificateUrl: { type: String },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

certificateSchema.pre('save', async function (next) {
  if (!this.certificateId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Certificate').countDocuments();
    this.certificateId = `CERT-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
