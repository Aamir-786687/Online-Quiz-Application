import { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { quizAPI } from '../services/api';

const QuizPage = () => {
  const { state, actions } = useQuiz();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    questions, 
    currentQuestionIndex, 
    answers, 
    timeRemaining, 
    isTimerActive 
  } = state;

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        actions.updateTimer(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTimerActive) {
      // Auto-submit when timer reaches 0
      handleSubmit();
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive, timeRemaining]);

  const handleAnswerSelect = (optionIndex) => {
    actions.setAnswer(optionIndex);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      actions.nextQuestion();
      // Reset per-question timer to 60s whenever the user proceeds to the next question
      actions.startTimer(60);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      actions.previousQuestion();
      // Reset per-question timer to 60s when navigating back
      actions.startTimer(60);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    actions.stopTimer();
    
    try {
      const result = await quizAPI.submitAnswers(answers);
      actions.submitQuiz(result);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-error-600';
    if (timeRemaining <= 30) return 'text-yellow-600';
    return 'text-primary-600';
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Quiz Challenge</h1>
            <div className={`text-2xl font-bold ${getTimerColor()}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` 
              }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQuestion.text}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`quiz-option ${
                  answers[currentQuestionIndex] === index ? 'selected' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    answers[currentQuestionIndex] === index 
                      ? 'border-primary-500 bg-primary-500' 
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestionIndex] === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-left">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className={`btn-secondary ${
              isFirstQuestion ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || answers[currentQuestionIndex] === null}
                className={`btn-success ${
                  isSubmitting || answers[currentQuestionIndex] === null 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Quiz'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={answers[currentQuestionIndex] === null}
                className={`btn-primary ${
                  answers[currentQuestionIndex] === null 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Answer Status */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {answers[currentQuestionIndex] !== null ? (
              <span className="text-success-600">✓ Answer selected</span>
            ) : (
              <span className="text-gray-500">Please select an answer to continue</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
