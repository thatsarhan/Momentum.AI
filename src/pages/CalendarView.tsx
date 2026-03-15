import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, getDay } from 'date-fns';
import { DailyLog, EffortLevel } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface CalendarViewProps {
  logs: Record<string, DailyLog>;
  onDateSelect: (date: string) => void;
}

const EFFORT_WEIGHTS: Record<EffortLevel, number> = {
  none: 0,
  minimum: 1,
  medium: 2,
  great: 3,
};

export function CalendarView({ logs, onDateSelect }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = monthStart;
  const endDate = monthEnd;

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Pad beginning of month
  const startDayOfWeek = getDay(monthStart);
  const paddingDays = Array.from({ length: startDayOfWeek }).map((_, i) => null);

  const getDayColor = (dateStr: string) => {
    const log = logs[dateStr];
    if (!log) return 'bg-stone-50 hover:bg-stone-100 border-stone-100';
    
    let score = 0;
    Object.values(log.habits).forEach(e => {
      score += EFFORT_WEIGHTS[e];
    });

    if (score === 0) return 'bg-stone-50 hover:bg-stone-100 border-stone-100';
    if (score <= 2) return 'bg-emerald-100 hover:bg-emerald-200 border-emerald-200 text-emerald-800';
    if (score <= 5) return 'bg-emerald-300 hover:bg-emerald-400 border-emerald-400 text-emerald-900';
    return 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white';
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 flex items-center justify-between border-b border-stone-100">
        <h2 className="text-2xl font-bold text-stone-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-stone-600" />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            Today
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-stone-600" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-stone-400 uppercase tracking-wider py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square rounded-xl bg-transparent" />
          ))}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const colorClass = getDayColor(dateStr);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(dateStr)}
                className={cn(
                  "aspect-square rounded-xl border flex flex-col items-center justify-center transition-all duration-200 relative group",
                  colorClass,
                  isCurrentDay && "ring-2 ring-indigo-500 ring-offset-2"
                )}
              >
                <span className={cn(
                  "text-lg font-medium",
                  colorClass.includes('text-white') ? 'text-white' : 'text-stone-700'
                )}>
                  {format(day, 'd')}
                </span>
                
                {/* Tooltip hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 rounded-xl">
                  <span className="sr-only">Edit {format(day, 'MMM d')}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
