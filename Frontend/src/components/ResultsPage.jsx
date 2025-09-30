import { useQuiz } from '../context/QuizContext';

const ResultsPage = () => {
  const { state, actions } = useQuiz();
  const { score, total, correctAnswers } = state;

  const percentage = Math.round((score / total) * 100);
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-success-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-error-600';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Excellent! Outstanding performance!';
    if (percentage >= 80) return 'Great job! Well done!';
    if (percentage >= 70) return 'Good work! Keep it up!';
    if (percentage >= 60) return 'Not bad! Room for improvement.';
    return 'Keep studying! You can do better!';
  };

  const getScoreEmoji = () => {
    if (percentage >= 90) return '🎉';
    if (percentage >= 80) return '👏';
    if (percentage >= 70) return '👍';
    if (percentage >= 60) return '😊';
    return '💪';
  };

  const handleRetakeQuiz = () => {
    actions.resetQuiz();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Score Summary */}
        <div className="card text-center mb-6">
          <div className="mb-6">
            <div className="text-6xl mb-4">{getScoreEmoji()}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
            <p className="text-lg text-gray-600 mb-4">{getScoreMessage()}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor()}`}>
                  {score}
                </div>
                <div className="text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">
                  {total}
                </div>
                <div className="text-gray-600">Total Questions</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor()}`}>
                  {percentage}%
                </div>
                <div className="text-gray-600">Score</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleRetakeQuiz}
            className="btn-primary text-lg py-3 px-8"
          >
            Take Quiz Again
          </button>
        </div>

        {/* Detailed Results */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h2>
          
          <div className="space-y-6">
            {correctAnswers.map((result, index) => (
              <div
                key={result.questionId}
                className={`p-4 rounded-lg border-2 ${
                  result.isCorrect 
                    ? 'border-success-200 bg-success-50' 
                    : 'border-error-200 bg-error-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Question {index + 1}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.isCorrect 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-error-100 text-error-800'
                  }`}>
                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>

                <p className="text-gray-800 mb-4">{result.questionText}</p>

                <div className="space-y-2">
                  {result.options.map((option, optionIndex) => {
                    let optionClass = 'p-3 rounded-lg border ';
                    let optionText = option;

                    if (optionIndex === result.correctAnswer) {
                      optionClass += 'border-success-500 bg-success-100 text-success-800';
                      optionText += ' ✓ (Correct Answer)';
                    } else if (optionIndex === result.userAnswer && !result.isCorrect) {
                      optionClass += 'border-error-500 bg-error-100 text-error-800';
                      optionText += ' ✗ (Your Answer)';
                    } else {
                      optionClass += 'border-gray-300 bg-white text-gray-700';
                    }

                    return (
                      <div key={optionIndex} className={optionClass}>
                        {optionText}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="card mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Strengths</h3>
              <div className="space-y-2">
                {correctAnswers.filter(r => r.isCorrect).length > 0 ? (
                  correctAnswers
                    .filter(r => r.isCorrect)
                    .map((result, index) => (
                      <div key={index} className="flex items-center text-success-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Question {correctAnswers.indexOf(result) + 1}
                      </div>
                    ))
                ) : (
                  <p className="text-gray-600">No correct answers to highlight</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Areas for Improvement</h3>
              <div className="space-y-2">
                {correctAnswers.filter(r => !r.isCorrect).length > 0 ? (
                  correctAnswers
                    .filter(r => !r.isCorrect)
                    .map((result, index) => (
                      <div key={index} className="flex items-center text-error-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Question {correctAnswers.indexOf(result) + 1}
                      </div>
                    ))
                ) : (
                  <p className="text-gray-600">Perfect score! No areas to improve</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
