import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { generateQuiz } from '../lib/gemini';
import { QuizQuestion } from '../types';
import { Loader2, CheckCircle2, XCircle, ArrowRight, BrainCircuit } from 'lucide-react';

export function QuizEngine({ userLevel, onComplete }: { userLevel: number, onComplete: (xp: number) => void }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress(p => {
          if (p >= 95) return p; // Hold at 95% until actually loaded
          return p + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [loading]);

  const loadQuiz = async () => {
    setLoading(true);
    setLoadingProgress(0);
    // Alternate topics based on level or random
    const topics = ["Critical Thinking & Riddles", "Spatial & Visual Reasoning", "Design Problem Identification"];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    const q = await generateQuiz(topic, userLevel);
    if (q && q.length > 0) {
      setQuestions(q);
    } else {
      // Fallback question if API fails
      setQuestions([{
        id: 'fallback',
        type: 'riddle',
        question: 'I have keys but no doors. I have space but no room. You can enter but can’t go outside. What am I?',
        options: ['A map', 'A keyboard', 'A mind', 'A safe'],
        correctAnswer: 1,
        explanation: 'A computer keyboard has keys, space(bar), and an enter key.'
      }]);
    }
    setLoading(false);
  };

  const handleSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      onComplete(score * 50 + 50); // Base 50 XP + 50 per correct answer
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 max-w-md mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center relative">
          <BrainCircuit className="w-10 h-10 text-indigo-600 animate-pulse" />
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full border-t-indigo-600 animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        
        <div className="text-center space-y-2 w-full">
          <h3 className="text-xl font-bold text-stone-900">Preparing your personalized NID quiz...</h3>
          <p className="text-stone-500 font-medium">This takes about 5 seconds.</p>
        </div>

        <div className="w-full space-y-2">
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-wider">
            <span>Analyzing level</span>
            <span>{Math.round(loadingProgress)}%</span>
          </div>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Quiz Complete!</h2>
        <p className="text-stone-600 mb-6">You scored {score} out of {questions.length}</p>
        <div className="p-4 bg-indigo-50 text-indigo-700 rounded-xl font-medium mb-8">
          +{score * 50 + 50} XP Earned
        </div>
        <button 
          onClick={() => {
            setQuizFinished(false);
            setCurrentIndex(0);
            setScore(0);
            setSelectedOption(null);
            setShowExplanation(false);
            loadQuiz();
          }}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors"
        >
          Take Another Quiz
        </button>
      </motion.div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600 font-medium">
          <BrainCircuit className="w-5 h-5" />
          <span>Adaptive Quiz Engine</span>
        </div>
        <div className="text-sm font-medium text-stone-500">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <motion.div 
        key={currentQ.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm"
      >
        <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
          {currentQ.type.replace('_', ' ')}
        </span>
        
        <h3 className="text-xl md:text-2xl font-semibold text-stone-900 mb-8 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "border-stone-200 hover:border-indigo-300 hover:bg-indigo-50 text-stone-700";
            let icon = null;

            if (showExplanation) {
              if (idx === currentQ.correctAnswer) {
                btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
              } else if (idx === selectedOption) {
                btnClass = "border-red-500 bg-red-50 text-red-900";
                icon = <XCircle className="w-5 h-5 text-red-600" />;
              } else {
                btnClass = "border-stone-100 bg-stone-50 text-stone-400 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${btnClass}`}
              >
                <span className="font-medium">{opt}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8"
          >
            <div className={`p-4 rounded-xl ${selectedOption === currentQ.correctAnswer ? 'bg-emerald-50 text-emerald-900' : 'bg-blue-50 text-blue-900'}`}>
              <p className="font-medium mb-1">
                {selectedOption === currentQ.correctAnswer ? 'Correct!' : 'Not quite.'}
              </p>
              <p className="text-sm opacity-90">{currentQ.explanation}</p>
            </div>
            
            <button 
              onClick={handleNext}
              className="mt-6 w-full py-4 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
