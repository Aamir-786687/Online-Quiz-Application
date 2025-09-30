import { QuizProvider, useQuiz } from './context/QuizContext';
import StartPage from './components/StartPage';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';

const AppContent = () => {
  const { state } = useQuiz();
  const { questions, quizCompleted } = state;

  // Show start page if no questions loaded
  if (questions.length === 0) {
    return <StartPage />;
  }

  // Show results page if quiz is completed
  if (quizCompleted) {
    return <ResultsPage />;
  }

  // Show quiz page if questions are loaded and quiz is not completed
  return <QuizPage />;
};

function App() {
  return (
    <QuizProvider>
      <div className="App">
        <AppContent />
      </div>
    </QuizProvider>
  );
}

export default App;
