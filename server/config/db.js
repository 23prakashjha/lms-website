import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (mongoUri) {
      const parts = mongoUri.split('?');
      const dbPart = parts[0];
      const lastSlash = dbPart.lastIndexOf('/');
      if (lastSlash !== -1) {
        const dbName = dbPart.substring(lastSlash + 1);
        if (dbName.includes(' ')) {
          const encodedName = dbName.replace(/ /g, '%20');
          parts[0] = dbPart.substring(0, lastSlash + 1) + encodedName;
          mongoUri = parts.join('?');
        }
      }
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected to:', mongoose.connection.name);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
