import express from 'express';
import Quiz from '../model/Quiz.js';

// Local fallback data in case DB is unavailable
const fallbackQuestions = [
  {
    _id: 'f1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctOption: 2
  },
  {
    _id: 'f2',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctOption: 1
  },
  {
    _id: 'f3',
    text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctOption: 1
  },
  {
    _id: 'f4',
    text: 'Who painted the Mona Lisa?',
    options: ['Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctOption: 2
  },
  {
    _id: 'f5',
    text: 'What is the largest mammal?',
    options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippo'],
    correctOption: 1
  }
];

const router = express.Router();

// GET /api/quiz - Fetch all quiz questions (without correct answers)
router.get('/', async (req, res) => {
  try {
    const questions = await Quiz.find({}, { correctOption: 0 });
    if (!questions || questions.length === 0) {
      // Serve fallback without answers
      return res.json(fallbackQuestions.map(({ correctOption, ...rest }) => rest));
    }
    return res.json(questions);
  } catch (error) {
    // On DB failure, serve fallback without answers to keep app usable
    return res.json(fallbackQuestions.map(({ correctOption, ...rest }) => rest));
  }
});

// POST /api/quiz/submit - Submit answers and calculate score
router.post('/submit', async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array is required' });
    }

    let questions;
    try {
      questions = await Quiz.find({});
    } catch (err) {
      questions = fallbackQuestions; // DB failed — use fallback with answers
    }

    if (!questions || questions.length === 0) {
      questions = fallbackQuestions;
    }

    let score = 0;
    const correctAnswers = [];

    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctOption;
      if (isCorrect) score++;

      correctAnswers.push({
        questionId: question._id,
        questionText: question.text,
        userAnswer,
        correctAnswer: question.correctOption,
        isCorrect,
        options: question.options
      });
    });

    return res.json({ score, total: questions.length, correctAnswers });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process quiz submission' });
  }
});

export default router;
