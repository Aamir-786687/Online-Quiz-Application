import { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { quizAPI } from '../services/api';

const StartPage = () => {
  const { actions } = useQuiz();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const startQuiz = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch questions from API
      const questions = await quizAPI.getQuestions();
      
      if (questions.length === 0) {
        throw new Error('No questions available');
      }
      
      // Set questions in context and start timer
      actions.setQuestions(questions);
      actions.startTimer(60); // 60 seconds timer
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Challenge</h1>
            <p className="text-gray-600">
              Test your knowledge with our interactive quiz! You'll have 60 seconds to complete all questions.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-error-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-error-700">{error}</span>
              </div>
            </div>
          )}

          <button
            onClick={startQuiz}
            disabled={isLoading}
            className={`w-full btn-primary text-lg py-3 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading Questions...
              </div>
            ) : (
              'Start Quiz'
            )}
          </button>

          <div className="mt-6 text-sm text-gray-500">
            <p>• Answer all questions within the time limit</p>
            <p>• Navigate between questions using Next/Previous</p>
            <p>• Your score will be calculated automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
