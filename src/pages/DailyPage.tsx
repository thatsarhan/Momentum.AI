import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Habit, DailyLog, EffortLevel } from '../types';
import { ArrowLeft, CheckCircle2, Circle, Save } from 'lucide-react';
import { cn } from '../lib/utils';

interface DailyPageProps {
  date: string;
  habits: Habit[];
  log: DailyLog;
  onSave: (log: DailyLog) => void;
  onBack: () => void;
}

export function DailyPage({ date, habits, log, onSave, onBack }: DailyPageProps) {
  const [currentLog, setCurrentLog] = useState<DailyLog>(log);

  // Reset local state if date prop changes
  useEffect(() => {
    setCurrentLog(log);
  }, [log, date]);

  const handleEffortChange = (habitId: string, effort: EffortLevel) => {
    setCurrentLog(prev => ({
      ...prev,
      habits: {
        ...prev.habits,
        [habitId]: prev.habits[habitId] === effort ? 'none' : effort // Toggle off if clicked again
      }
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentLog(prev => ({ ...prev, notes: e.target.value }));
  };

  const handleSave = () => {
    onSave(currentLog);
  };

  const [year, month, day] = date.split('-').map(Number);
  const displayDate = format(new Date(year, month - 1, day), 'EEEE, MMMM d, yyyy');

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Overview
        </button>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Save Progress
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50">
          <h2 className="text-2xl font-bold text-stone-900">{displayDate}</h2>
          <p className="text-stone-500 mt-1">Log your effort for today. Every little bit counts.</p>
        </div>

        <div className="p-6 space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
              Daily Habits
            </h3>
            
            {habits.length === 0 ? (
              <p className="text-stone-500 italic">No habits set up yet. Go to Habits Setup to add some.</p>
            ) : (
              <div className="space-y-4">
                {habits.map(habit => {
                  const currentEffort = currentLog.habits?.[habit.id] || 'none';
                  
                  return (
                    <div key={habit.id} className="p-5 rounded-xl border border-stone-200 bg-white shadow-sm">
                      <h4 className="font-semibold text-stone-900 mb-4">{habit.name}</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <EffortButton 
                          level="minimum"
                          current={currentEffort}
                          desc={habit.minimumDesc}
                          onClick={() => handleEffortChange(habit.id, 'minimum')}
                        />
                        <EffortButton 
                          level="medium"
                          current={currentEffort}
                          desc={habit.mediumDesc}
                          onClick={() => handleEffortChange(habit.id, 'medium')}
                        />
                        <EffortButton 
                          level="great"
                          current={currentEffort}
                          desc={habit.greatDesc}
                          onClick={() => handleEffortChange(habit.id, 'great')}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-stone-900">Notes & Reflections</h3>
            <textarea
              value={currentLog.notes || ''}
              onChange={handleNotesChange}
              placeholder="How did today go? Any blockers or wins?"
              className="w-full h-32 p-4 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EffortButton({ level, current, desc, onClick }: { level: EffortLevel, current: EffortLevel, desc: string, onClick: () => void }) {
  const isSelected = current === level;
  
  let baseColor = '';
  let activeColor = '';
  let label = '';

  switch (level) {
    case 'minimum':
      baseColor = 'hover:border-blue-300 hover:bg-blue-50';
      activeColor = 'border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500';
      label = 'Bare Minimum';
      break;
    case 'medium':
      baseColor = 'hover:border-emerald-300 hover:bg-emerald-50';
      activeColor = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500';
      label = 'Okay Day';
      break;
    case 'great':
      baseColor = 'hover:border-purple-300 hover:bg-purple-50';
      activeColor = 'border-purple-500 bg-purple-50 text-purple-900 ring-1 ring-purple-500';
      label = 'Great Day';
      break;
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start p-3 rounded-lg border-2 text-left transition-all duration-200",
        isSelected ? activeColor : `border-stone-100 bg-stone-50 text-stone-600 ${baseColor}`
      )}
    >
      <div className="flex items-center gap-2 mb-1 w-full">
        {isSelected ? (
          <CheckCircle2 className={cn("w-4 h-4 shrink-0", 
            level === 'minimum' ? 'text-blue-500' : 
            level === 'medium' ? 'text-emerald-500' : 'text-purple-500'
          )} />
        ) : (
          <Circle className="w-4 h-4 shrink-0 opacity-40" />
        )}
        <span className="font-medium text-sm">{label}</span>
      </div>
      <span className="text-xs opacity-80 mt-1 line-clamp-2">{desc}</span>
    </button>
  );
}
