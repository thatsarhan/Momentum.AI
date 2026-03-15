import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { Habit, EffortLevel, DailyLog } from '../types';

interface HabitLoggerModalProps {
  date: string;
  habits: Habit[];
  existingLog?: DailyLog;
  onClose: () => void;
  onSave: (log: DailyLog, xpGained: number) => void;
}

export function HabitLoggerModal({ date, habits, existingLog, onClose, onSave }: HabitLoggerModalProps) {
  const [efforts, setEfforts] = useState<Record<string, EffortLevel>>(
    existingLog?.habits || {}
  );

  const handleSave = () => {
    let xpGained = 0;
    
    // Calculate XP gained from new efforts compared to existing
    Object.entries(efforts).forEach(([habitId, effort]) => {
      const oldEffort = (existingLog?.habits[habitId] as EffortLevel) || 'none';
      
      const getXp = (e: EffortLevel) => {
        if (e === 'minimum') return 10;
        if (e === 'medium') return 25;
        if (e === 'great') return 50;
        return 0;
      };

      const newXp = getXp(effort as EffortLevel);
      const oldXp = getXp(oldEffort);
      
      if (newXp > oldXp) {
        xpGained += (newXp - oldXp);
      }
    });

    onSave({ date, habits: efforts, notes: existingLog?.notes || '' }, xpGained);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Log Habits</h2>
            <p className="text-stone-500 font-medium">{date}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-stone-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {habits.map(habit => (
            <div key={habit.id} className="space-y-3">
              <h3 className="font-bold text-stone-900 text-lg">{habit.name}</h3>
              <div className="grid grid-cols-1 gap-2">
                {(['none', 'minimum', 'medium', 'great'] as EffortLevel[]).map(level => {
                  const isSelected = (efforts[habit.id] || 'none') === level;
                  
                  let label = 'Did not do';
                  let desc = '';
                  let xp = 0;
                  if (level === 'minimum') { label = 'Minimum'; desc = habit.minimumDesc; xp = 10; }
                  if (level === 'medium') { label = 'Medium'; desc = habit.mediumDesc; xp = 25; }
                  if (level === 'great') { label = 'Great'; desc = habit.greatDesc; xp = 50; }

                  return (
                    <button
                      key={level}
                      onClick={() => setEfforts(prev => ({ ...prev, [habit.id]: level }))}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                          : 'border-stone-100 hover:border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <div className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-stone-700'}`}>
                          {label} {xp > 0 && <span className="text-indigo-600 text-sm ml-2">+{xp} XP</span>}
                        </div>
                        {desc && <div className={`text-sm mt-1 ${isSelected ? 'text-indigo-700' : 'text-stone-500'}`}>{desc}</div>}
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-stone-300'
                      }`}>
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-stone-100 bg-stone-50">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Save Progress
          </button>
        </div>
      </motion.div>
    </div>
  );
}
