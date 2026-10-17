import React, { useState } from 'react';
import { QUIZZES } from '../../data/quizzes';
import { QuizQuestion } from '../../types';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, RotateCcw, HelpCircle, Trophy } from 'lucide-react';

interface QuizEngineProps {
  onScoreUpdate: (points: number) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({ onScoreUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const filteredQuizzes = QUIZZES.filter(
    (q) => selectedCategory === 'all' || q.subject === selectedCategory || q.category === selectedCategory
  );

  const currentQuestion: QuizQuestion | undefined = filteredQuizzes[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;

    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      onScoreUpdate(10);

      if (newStreak >= 3) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < filteredQuizzes.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowHint(false);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setStreak(0);
    setShowHint(false);
    setIsCompleted(false);
  };

  if (filteredQuizzes.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-800 rounded-2xl">
        <p className="text-slate-400">No quiz questions found for this topic filter.</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto bg-slate-800/90 border border-slate-700/60 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto text-amber-400">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Quiz Challenge Completed!</h2>
          <p className="text-sm text-slate-400 mt-1">You solved all questions in this session.</p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Final Score</span>
            <span className="text-2xl font-mono font-bold text-indigo-400">{score} pts</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Questions Solved</span>
            <span className="text-2xl font-mono font-bold text-emerald-400">
              {filteredQuizzes.length} / {filteredQuizzes.length}
            </span>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-slate-800/90 border border-slate-700/60 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-indigo-950 text-indigo-300 font-mono text-xs font-bold rounded-lg border border-indigo-500/30">
            Question {currentIndex + 1} of {filteredQuizzes.length}
          </div>
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            {currentQuestion?.category}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-amber-400">
            <Award className="w-4 h-4" /> Score: {score}
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 text-rose-400 font-bold animate-pulse">
              🔥 Streak: {streak}
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 text-xs overflow-x-auto">
        {['all', 'physics', 'maths'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              handleRestart();
            }}
            className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Question Text */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100 leading-snug">
          {currentQuestion?.question}
        </h2>

        {currentQuestion?.formulaHint && (
          <div className="text-right">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 ml-auto font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showHint ? 'Hide Hint' : 'Show Formula Hint'}
            </button>
            {showHint && (
              <div className="mt-2 bg-slate-950 p-2.5 rounded-lg border border-indigo-500/30 font-mono text-xs text-indigo-300 inline-block text-left">
                Hint: {currentQuestion.formulaHint}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {currentQuestion?.options.map((option, idx) => {
          let btnStyle = 'bg-slate-900/80 border-slate-700/80 hover:bg-slate-700/80 text-slate-200';
          if (selectedOption === idx) {
            btnStyle = 'bg-indigo-950/80 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500';
          }

          if (isSubmitted) {
            if (idx === currentQuestion.correctAnswerIndex) {
              btnStyle = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-semibold';
            } else if (selectedOption === idx) {
              btnStyle = 'bg-rose-950/80 border-rose-500/80 text-rose-200';
            } else {
              btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
            >
              <span>{option}</span>
              {isSubmitted && idx === currentQuestion.correctAnswerIndex && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {isSubmitted && selectedOption === idx && idx !== currentQuestion.correctAnswerIndex && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation Card */}
      {isSubmitted && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs animate-fade-in">
          <span className="font-bold text-indigo-400 uppercase tracking-wider block">
            Solution Explanation
          </span>
          <p className="text-slate-300 leading-relaxed">{currentQuestion?.explanation}</p>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-700 flex justify-end">
        {!isSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
              selectedOption !== null
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition-all shadow-lg"
          >
            Next Question →
          </button>
        )}
      </div>
    </div>
  );
};
