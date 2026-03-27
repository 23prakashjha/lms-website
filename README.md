# LMS Platform - Learning Management System

A full-featured Learning Management System built with MERN Stack (MongoDB, Express, React, Node.js).

## Features

### Authentication
- User registration with role selection (Student/Instructor)
- JWT-based authentication
- Password encryption with bcrypt
- Email verification
- Password reset functionality

### Course Management
- Create, edit, and delete courses
- Course publishing/draft system
- Category and level organization
- Course search and filtering
- Course ratings and reviews

### Lesson System
- Multiple lesson types (Video, Text, PDF)
- Drag-and-drop lesson ordering
- Lesson completion tracking
- Preview lessons

### Student Features
- Browse and enroll in courses
- Progress tracking
- Course player with video support
- Bookmarks and notes
- Certificates on completion

### Instructor Features
- Instructor dashboard
- Course analytics
- Student management
- Assignment creation and grading
- Quiz management

### Admin Features
- User management
- Course moderation
- Revenue tracking
- Platform analytics

### Payment System
- Razorpay integration
- Order management
- Payment verification
- Revenue reports

### Real-time Features
- Socket.io chat system
- Course chat rooms
- Message notifications

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS
- React Router v6
- Axios
- Recharts for analytics
- Socket.io-client

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io
- Multer for file uploads
- Cloudinary for media storage
- Razorpay for payments

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd lms-website
```

2. Install root dependencies
```bash
npm install
```

3. Install server dependencies
```bash
cd server
npm install
```

4. Install client dependencies
```bash
cd ../client
npm install
```

5. Configure environment variables

Create `.env` in `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lms-platform
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

6. Run the application

Development mode (runs both server and client):
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

7. Open the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
lms-website/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   └── ...
├── server/                 # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/        # Express middleware
│   ├── config/           # Configuration
│   └── ...
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/profile` - Update profile
- `GET /api/users/` - Get all users (admin)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:slug` - Get course details
- `POST /api/courses` - Create course (instructor)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Lessons
- `POST /api/lessons` - Create lesson
- `GET /api/lessons/:id` - Get lesson
- `PUT /api/lessons/:id` - Update lesson
- `DELETE /api/lessons/:id` - Delete lesson

### Enrollments
- `POST /api/enrollments/enroll` - Enroll in course
- `GET /api/enrollments/my-enrollments` - Get my enrollments
- `PUT /api/enrollments/course/:courseId/lesson-complete` - Mark lesson complete

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment

## User Roles

### Student
- Browse and enroll in courses
- Track learning progress
- Submit assignments
- Take quizzes
- Earn certificates

### Instructor
- Create and manage courses
- Add lessons and content
- Create assignments and quizzes
- Grade submissions
- View analytics

### Admin
- Manage all users
- Moderate courses
- View platform analytics
- Handle payments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - See LICENSE file for details

## Support

For support, email support@lmsplatform.com or create an issue in the repository.
