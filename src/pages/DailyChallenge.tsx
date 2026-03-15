import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Flame, Star, ArrowRight, Zap } from 'lucide-react';

const CHALLENGES = [
  {
    id: '1',
    type: 'task',
    title: 'Quick Sketch',
    description: 'Sketch any object near you in under 5 minutes.',
    xp: 20
  },
  {
    id: '2',
    type: 'puzzle',
    title: 'Visual Reasoning',
    description: 'Identify symmetry in 3 everyday objects around you.',
    xp: 15
  },
  {
    id: '3',
    type: 'reflection',
    title: 'Design Awareness',
    description: 'Write down one design flaw you noticed today and how you would fix it.',
    xp: 25
  }
];

export function DailyChallenge({ onComplete, currentStreak }: { onComplete: (xp: number) => void, currentStreak: number }) {
  const [step, setStep] = useState<'intro' | 'active' | 'completion' | 'reward' | 'streak'>('intro');
  const [challenge, setChallenge] = useState(CHALLENGES[0]);

  useEffect(() => {
    // Pick a random challenge on mount
    setChallenge(CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]);
  }, []);

  const handleNext = () => {
    if (step === 'intro') setStep('active');
    else if (step === 'active') setStep('completion');
    else if (step === 'completion') setStep('reward');
    else if (step === 'reward') setStep('streak');
    else if (step === 'streak') onComplete(challenge.xp);
  };

  return (
    <div className="max-w-2xl mx-auto min-h-[600px] flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8 w-full"
          >
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Zap className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-stone-900">Daily Challenge</h2>
              <p className="text-stone-500 mt-2 text-lg">A quick task to build your momentum.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border-2 border-stone-100 shadow-sm">
              <h3 className="text-xl font-bold text-stone-900 mb-2">{challenge.title}</h3>
              <p className="text-stone-600">{challenge.description}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              Start Challenge <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full bg-white p-8 rounded-3xl border-2 border-stone-100 shadow-xl text-center space-y-8"
          >
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-full text-sm tracking-wide uppercase">
                Active Challenge
              </span>
              <h2 className="text-3xl font-bold text-stone-900">{challenge.title}</h2>
              <p className="text-xl text-stone-600 font-medium">{challenge.description}</p>
            </div>
            
            <div className="pt-8">
              <button
                onClick={handleNext}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
              >
                I've Completed This
              </button>
            </div>
          </motion.div>
        )}

        {step === 'completion' && (
          <motion.div
            key="completion"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <div className="w-32 h-32 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <h2 className="text-4xl font-bold text-stone-900">Great Job!</h2>
            <p className="text-xl text-stone-500">You showed up today.</p>
            <button
              onClick={handleNext}
              className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 transition-colors mt-8"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 'reward' && (
          <motion.div
            key="reward"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6 w-full max-w-sm"
          >
            <div className="w-32 h-32 bg-yellow-100 text-yellow-500 rounded-3xl flex items-center justify-center mx-auto rotate-12 shadow-lg shadow-yellow-100">
              <Star className="w-16 h-16 fill-current" />
            </div>
            <h2 className="text-4xl font-bold text-stone-900">+{challenge.xp} XP</h2>
            <p className="text-xl text-stone-500">Small progress builds momentum.</p>
            <button
              onClick={handleNext}
              className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 transition-colors mt-8"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 'streak' && (
          <motion.div
            key="streak"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 w-full max-w-sm"
          >
            <div className="w-32 h-32 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-orange-100">
              <Flame className="w-16 h-16 fill-current" />
            </div>
            <h2 className="text-4xl font-bold text-stone-900">{currentStreak + 1} Day Streak!</h2>
            <p className="text-xl text-stone-500">You are building consistency.</p>
            
            <div className="w-full bg-stone-100 h-4 rounded-full overflow-hidden mt-8">
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-orange-500 rounded-full"
              />
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-colors mt-8 shadow-lg shadow-orange-200"
            >
              Claim Reward
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
