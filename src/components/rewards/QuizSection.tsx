import React, { useState } from 'react';
import { useRewards } from '../../contexts/RewardsContext';
import { BookOpen, CheckCircle, DollarSign, Play, Award } from 'lucide-react';

export const QuizSection: React.FC = () => {
  const { quizzes, completeQuiz } = useRewards();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const startQuiz = (quizId: string) => {
    setSelectedQuiz(quizId);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    if (!quiz) return;

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    if (!quiz) return;

    const correctAnswers = answers.filter((answer, index) => 
      answer === quiz.questions[index].correctAnswer
    ).length;
    
    const score = (correctAnswers / quiz.questions.length) * 100;
    
    if (score >= quiz.passingScore) {
      completeQuiz(quiz.id, score);
    }
    
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (selectedQuiz && !showResults) {
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    if (!quiz) return null;

    const question = quiz.questions[currentQuestion];

    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">{quiz.title}</h2>
          <button
            onClick={resetQuiz}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{formatCurrency(quiz.reward)} reward</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-white text-lg mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  answers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                    : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={nextQuestion}
          disabled={answers[currentQuestion] === undefined}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    );
  }

  if (showResults) {
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    if (!quiz) return null;

    const correctAnswers = answers.filter((answer, index) => 
      answer === quiz.questions[index].correctAnswer
    ).length;
    
    const score = (correctAnswers / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            passed ? 'bg-green-900/30' : 'bg-red-900/30'
          }`}>
            {passed ? (
              <Award className="text-green-400" size={32} />
            ) : (
              <BookOpen className="text-red-400" size={32} />
            )}
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-2">
            {passed ? 'Congratulations!' : 'Try Again'}
          </h2>
          
          <p className="text-gray-400 mb-4">
            You scored {score.toFixed(0)}% ({correctAnswers}/{quiz.questions.length} correct)
          </p>
          
          {passed && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-4">
              <p className="text-green-400 font-semibold">
                You earned {formatCurrency(quiz.reward)}!
              </p>
            </div>
          )}
          
          <button
            onClick={resetQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-white text-xl font-bold mb-6 flex items-center">
        <BookOpen className="mr-2" size={20} />
        Educational Quizzes
      </h2>
      
      <div className="space-y-4">
        {quizzes.map(quiz => (
          <div
            key={quiz.id}
            className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
              quiz.isCompleted 
                ? 'border-green-400 opacity-75' 
                : 'border-blue-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-white font-semibold">{quiz.title}</h3>
                <p className="text-gray-400 text-sm">{quiz.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-400 font-bold mb-1">
                  <DollarSign size={16} className="mr-1" />
                  {formatCurrency(quiz.reward)}
                </div>
                <div className="text-xs text-gray-400">
                  {quiz.questions.length} questions
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Passing score: {quiz.passingScore}%
              </div>
              
              {quiz.isCompleted ? (
                <div className="flex items-center text-green-400 text-sm">
                  <CheckCircle size={16} className="mr-1" />
                  Completed
                </div>
              ) : (
                <button
                  onClick={() => startQuiz(quiz.id)}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Play size={16} className="mr-1" />
                  Start Quiz
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};