import { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  score: null,
  total: 0,
  correctAnswers: [],
  isLoading: false,
  error: null,
  timeRemaining: 60,
  isTimerActive: false,
  quizCompleted: false
};

// Action types
const QUIZ_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_ERROR: 'SET_ERROR',
  SET_ANSWER: 'SET_ANSWER',
  NEXT_QUESTION: 'NEXT_QUESTION',
  PREVIOUS_QUESTION: 'PREVIOUS_QUESTION',
  SUBMIT_QUIZ: 'SUBMIT_QUIZ',
  RESET_QUIZ: 'RESET_QUIZ',
  START_TIMER: 'START_TIMER',
  UPDATE_TIMER: 'UPDATE_TIMER',
  STOP_TIMER: 'STOP_TIMER',
  SET_QUIZ_COMPLETED: 'SET_QUIZ_COMPLETED'
};

// Reducer function
const quizReducer = (state, action) => {
  switch (action.type) {
    case QUIZ_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case QUIZ_ACTIONS.SET_QUESTIONS:
      return { 
        ...state, 
        questions: action.payload, 
        answers: new Array(action.payload.length).fill(null),
        isLoading: false,
        error: null
      };
    
    case QUIZ_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case QUIZ_ACTIONS.SET_ANSWER:
      const newAnswers = [...state.answers];
      newAnswers[state.currentQuestionIndex] = action.payload;
      return { ...state, answers: newAnswers };
    
    case QUIZ_ACTIONS.NEXT_QUESTION:
      return { 
        ...state, 
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1)
      };
    
    case QUIZ_ACTIONS.PREVIOUS_QUESTION:
      return { 
        ...state, 
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
      };
    
    case QUIZ_ACTIONS.SUBMIT_QUIZ:
      return { 
        ...state, 
        score: action.payload.score,
        total: action.payload.total,
        correctAnswers: action.payload.correctAnswers,
        isLoading: false,
        quizCompleted: true
      };
    
    case QUIZ_ACTIONS.RESET_QUIZ:
      return { 
        ...initialState, 
        questions: state.questions // Keep questions for retry
      };
    
    case QUIZ_ACTIONS.START_TIMER:
      return { ...state, isTimerActive: true, timeRemaining: action.payload };
    
    case QUIZ_ACTIONS.UPDATE_TIMER:
      return { ...state, timeRemaining: action.payload };
    
    case QUIZ_ACTIONS.STOP_TIMER:
      return { ...state, isTimerActive: false };
    
    case QUIZ_ACTIONS.SET_QUIZ_COMPLETED:
      return { ...state, quizCompleted: action.payload };
    
    default:
      return state;
  }
};

// Context
const QuizContext = createContext();

// Provider component
export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const actions = {
    setLoading: (loading) => dispatch({ type: QUIZ_ACTIONS.SET_LOADING, payload: loading }),
    setQuestions: (questions) => dispatch({ type: QUIZ_ACTIONS.SET_QUESTIONS, payload: questions }),
    setError: (error) => dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: error }),
    setAnswer: (answer) => dispatch({ type: QUIZ_ACTIONS.SET_ANSWER, payload: answer }),
    nextQuestion: () => dispatch({ type: QUIZ_ACTIONS.NEXT_QUESTION }),
    previousQuestion: () => dispatch({ type: QUIZ_ACTIONS.PREVIOUS_QUESTION }),
    submitQuiz: (result) => dispatch({ type: QUIZ_ACTIONS.SUBMIT_QUIZ, payload: result }),
    resetQuiz: () => dispatch({ type: QUIZ_ACTIONS.RESET_QUIZ }),
    startTimer: (time) => dispatch({ type: QUIZ_ACTIONS.START_TIMER, payload: time }),
    updateTimer: (time) => dispatch({ type: QUIZ_ACTIONS.UPDATE_TIMER, payload: time }),
    stopTimer: () => dispatch({ type: QUIZ_ACTIONS.STOP_TIMER }),
    setQuizCompleted: (completed) => dispatch({ type: QUIZ_ACTIONS.SET_QUIZ_COMPLETED, payload: completed })
  };

  return (
    <QuizContext.Provider value={{ state, actions }}>
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook to use the context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
