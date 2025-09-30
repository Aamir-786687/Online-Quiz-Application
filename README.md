# Online Quiz Application

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) quiz application where users can take interactive quizzes with real-time scoring and detailed results.

## 🚀 Features

### Backend Features
- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **Quiz Management**: Store questions with multiple choice options
- **Scoring System**: Automatic score calculation and detailed results
- **Error Handling**: Comprehensive error handling middleware
- **Testing**: Jest test suite for API endpoints
- **Seed Data**: Pre-populated sample questions

### Frontend Features
- **Modern React UI** with Context API for state management
- **Responsive Design** with TailwindCSS
- **Interactive Quiz Interface** with navigation between questions
- **Real-time Timer** with auto-submit functionality
- **Detailed Results** showing correct/incorrect answers
- **Progress Tracking** with visual progress bar
- **Retake Functionality** for multiple attempts

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **TailwindCSS** - CSS framework
- **Axios** - HTTP client
- **Context API** - State management

## 📁 Project Structure

```
Online-Quiz-Application/
├── Backend/
│   ├── database/
│   │   └── db.js                 # Database connection
│   ├── model/
│   │   └── Quiz.js               # Quiz schema
│   ├── routes/
│   │   └── quizRoutes.js         # API routes
│   ├── middleware/
│   │   └── errorHandler.js       # Error handling
│   ├── scripts/
│   │   └── seedData.js           # Database seeding
│   ├── tests/
│   │   ├── quiz.test.js          # Test cases
│   │   └── setup.js              # Test setup
│   ├── server.js                 # Main server file
│   ├── package.json
│   └── jest.config.js            # Jest configuration
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── StartPage.jsx      # Landing page
    │   │   ├── QuizPage.jsx       # Quiz interface
    │   │   └── ResultsPage.jsx    # Results display
    │   ├── context/
    │   │   └── QuizContext.jsx    # State management
    │   ├── services/
    │   │   └── api.js             # API calls
    │   ├── App.jsx                # Main app component
    │   ├── main.jsx               # Entry point
    │   └── index.css              # Global styles
    ├── package.json
    ├── tailwind.config.js         # TailwindCSS config
    └── postcss.config.js          # PostCSS config
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Online-Quiz-Application
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

### Environment Configuration

1. **Backend Environment**
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/quiz-app
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

2. **Frontend Environment**
   Create a `.env` file in the `Frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Database Setup

1. **Start MongoDB**
   - Local: Start your MongoDB service
   - Atlas: Use your MongoDB Atlas connection string

2. **Seed the Database**
   ```bash
   cd Backend
   npm run seed
   ```
   This will populate the database with 8 sample questions.

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm start
   ```
   Server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to start using the quiz application.

## 🧪 Testing

### Backend Tests
```bash
cd Backend
npm test
```

The test suite includes:
- API endpoint testing
- Quiz scoring logic validation
- Error handling verification
- Database interaction tests

### Test Coverage
```bash
cd Backend
npm test -- --coverage
```

## 📊 API Endpoints

### Quiz Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quiz` | Fetch all quiz questions (without correct answers) |
| POST | `/api/quiz/submit` | Submit answers and get results |
| GET | `/api/health` | Health check endpoint |

### Request/Response Examples

**GET /api/quiz**
```json
[
  {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "text": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"]
  }
]
```

**POST /api/quiz/submit**
```json
// Request
{
  "answers": [2, 1, 0, 1, 2]
}

// Response
{
  "score": 4,
  "total": 5,
  "correctAnswers": [
    {
      "questionId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "questionText": "What is the capital of France?",
      "userAnswer": 2,
      "correctAnswer": 2,
      "isCorrect": true,
      "options": ["London", "Berlin", "Paris", "Madrid"]
    }
  ]
}
```

## 🎯 Usage Guide

### Taking a Quiz

1. **Start Page**: Click "Start Quiz" to begin
2. **Quiz Interface**: 
   - Answer questions by selecting options
   - Use "Next" and "Previous" buttons to navigate
   - Monitor the 60-second countdown timer
   - Timer auto-submits when it reaches zero
3. **Results Page**: 
   - View your score and percentage
   - Review detailed answers for each question
   - See performance insights
   - Option to retake the quiz

### Quiz Features

- **Timer**: 60-second countdown with visual indicators
- **Progress Bar**: Shows completion percentage
- **Answer Validation**: Must select an answer to proceed
- **Auto-submit**: Automatic submission when timer expires
- **Detailed Review**: See correct answers and explanations

## 🔧 Development

### Adding New Questions

1. **Via Seed Script**: Add questions to `Backend/scripts/seedData.js`
2. **Via Database**: Directly insert into MongoDB
3. **Via API**: Create POST endpoint for question management

### Customizing the UI

- **Styling**: Modify `Frontend/src/index.css` for global styles
- **Components**: Update component files in `Frontend/src/components/`
- **Theme**: Customize colors in `Frontend/tailwind.config.js`

### Extending Functionality

- **User Authentication**: Add user registration/login
- **Question Categories**: Implement topic-based quizzes
- **Leaderboards**: Add scoring and ranking systems
- **Analytics**: Track user performance over time

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure database permissions

2. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check if frontend is running on correct port

3. **API Not Responding**
   - Check if backend server is running
   - Verify API URL in frontend `.env`
   - Check network connectivity

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check Node.js version compatibility
   - Verify all environment variables are set

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Happy Quizzing! 🎉**
