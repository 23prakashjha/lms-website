import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
      const questionIdx = mongoUri.indexOf('?');
      const slashIdx = mongoUri.lastIndexOf('/', questionIdx === -1 ? mongoUri.length : questionIdx);
      if (slashIdx !== -1 && questionIdx !== -1) {
        const dbName = mongoUri.substring(slashIdx + 1, questionIdx);
        if (dbName.includes(' ')) {
          const encoded = encodeURIComponent(dbName);
          mongoUri = mongoUri.substring(0, slashIdx + 1) + encoded + mongoUri.substring(questionIdx);
        }
      }
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
