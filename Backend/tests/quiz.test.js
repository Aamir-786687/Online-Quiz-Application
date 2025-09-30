import request from 'supertest';
import express from 'express';
import quizRoutes from '../routes/quizRoutes.js';
import Quiz from '../model/Quiz.js';
import mongoose from 'mongoose';

// Mock Quiz model
jest.mock('../model/Quiz.js');

const app = express();
app.use(express.json());
app.use('/api/quiz', quizRoutes);

describe('Quiz API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/quiz', () => {
    it('should fetch all quiz questions without correct answers', async () => {
      const mockQuestions = [
        {
          _id: '1',
          text: 'What is 2+2?',
          options: ['3', '4', '5', '6']
        },
        {
          _id: '2',
          text: 'What is the capital of France?',
          options: ['London', 'Paris', 'Berlin', 'Madrid']
        }
      ];

      Quiz.find.mockResolvedValue(mockQuestions);

      const response = await request(app)
        .get('/api/quiz')
        .expect(200);

      expect(response.body).toEqual(mockQuestions);
      expect(Quiz.find).toHaveBeenCalledWith({}, { correctOption: 0 });
    });

    it('should handle database errors', async () => {
      Quiz.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/quiz')
        .expect(500);

      expect(response.body.error).toBe('Failed to fetch quiz questions');
    });
  });

  describe('POST /api/quiz/submit', () => {
    it('should calculate score correctly', async () => {
      const mockQuestions = [
        {
          _id: '1',
          text: 'What is 2+2?',
          options: ['3', '4', '5', '6'],
          correctOption: 1
        },
        {
          _id: '2',
          text: 'What is the capital of France?',
          options: ['London', 'Paris', 'Berlin', 'Madrid'],
          correctOption: 1
        }
      ];

      const userAnswers = [1, 0]; // Correct, Wrong

      Quiz.find.mockResolvedValue(mockQuestions);

      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answers: userAnswers })
        .expect(200);

      expect(response.body.score).toBe(1);
      expect(response.body.total).toBe(2);
      expect(response.body.correctAnswers).toHaveLength(2);
      expect(response.body.correctAnswers[0].isCorrect).toBe(true);
      expect(response.body.correctAnswers[1].isCorrect).toBe(false);
    });

    it('should handle missing answers', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Answers array is required');
    });

    it('should handle invalid answers format', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answers: 'not an array' })
        .expect(400);

      expect(response.body.error).toBe('Answers array is required');
    });

    it('should handle no questions found', async () => {
      Quiz.find.mockResolvedValue([]);

      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answers: [1, 2] })
        .expect(404);

      expect(response.body.error).toBe('No quiz questions found');
    });

    it('should handle database errors during submission', async () => {
      Quiz.find.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answers: [1, 2] })
        .expect(500);

      expect(response.body.error).toBe('Failed to process quiz submission');
    });
  });

  describe('Scoring Logic Tests', () => {
    it('should calculate perfect score', async () => {
      const mockQuestions = [
        {
          _id: '1',
          text: 'What is 2+2?',
          options: ['3', '4', '5', '6'],
          correctOption: 1
        },
        {
          _id: '2',
          text: 'What is 3+3?',
          options: ['5', '6', '7', '8'],
          correctOption: 1
        }
      ];

      const userAnswers = [1, 1]; // Both correct

      Quiz.find.mockResolvedValue(mockQuestions);

      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answers: userAnswers })
        .expect(200);

      expect(response.body.score).toBe(2);
      expect(response.body.total).toBe(2);
      expect(response.body.correctAnswers.every(q => q.isCorrect)).toBe(true);
    });

    it('should calculate zero score', async () => {
      const mockQuestions = [
        {
          _id: '1',
          text: 'What is 2+2?',
          options: ['3', '4', '5', '6'],
          correctOption: 1
        },
        {
          _id: '2',
          text: 'What is 3+3?',
          options: ['5', '6', '7', '8'],
          correctOption: 1
        }
      ];

      const userAnswers = [0, 0]; // Both wrong

      Quiz.find.mockResolvedValue(mockQuestions);

      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answers: userAnswers })
        .expect(200);

      expect(response.body.score).toBe(0);
      expect(response.body.total).toBe(2);
      expect(response.body.correctAnswers.every(q => !q.isCorrect)).toBe(true);
    });
  });
});
