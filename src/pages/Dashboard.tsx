import React, { useMemo } from 'react';
import { format, subDays, eachDayOfInterval, isSameDay, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { Habit, DailyLog, EffortLevel } from '../types';
import { Trophy, Flame, Target, TrendingUp, Calendar as CalendarIcon, Zap, ArrowRight, CheckCircle2, Activity } from 'lucide-react';

interface DashboardProps {
  habits: Habit[];
  logs: Record<string, DailyLog>;
  onDateSelect: (date: string) => void;
  onStartChallenge: () => void;
  challengeCompletedToday: boolean;
}

const EFFORT_WEIGHTS: Record<EffortLevel, number> = {
  none: 0,
  minimum: 1,
  medium: 2,
  great: 3,
};

export function Dashboard({ habits, logs, onDateSelect, onStartChallenge, challengeCompletedToday }: DashboardProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const stats = useMemo(() => {
    const dates = Object.keys(logs).sort();
    let currentStreak = 0;
    let totalEffort = 0;
    let daysActive = 0;

    // Calculate streak
    let checkDate = new Date();
    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const log = logs[dateStr];
      const hasEffort = log && Object.values(log.habits).some(e => e !== 'none');
      
      if (hasEffort) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else if (dateStr === today) {
        // If today has no effort, check yesterday before breaking
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }

    // Calculate total effort and days active
    Object.values(logs).forEach(log => {
      let dailyEffort = 0;
      let active = false;
      Object.values(log.habits).forEach(effort => {
        dailyEffort += EFFORT_WEIGHTS[effort];
        if (effort !== 'none') active = true;
      });
      totalEffort += dailyEffort;
      if (active) daysActive++;
    });

    return { currentStreak, totalEffort, daysActive };
  }, [logs, today]);

  const heatmapDays = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 27); // Last 28 days (4 weeks)
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const log = logs[dateStr];
      let score = 0;
      if (log) {
        Object.values(log.habits).forEach(e => {
          score += EFFORT_WEIGHTS[e];
        });
      }
      return {
        date: dateStr,
        displayDate: format(day, 'MMM d'),
        score,
        isToday: dateStr === today
      };
    });
  }, [logs, today]);

  const weeklyStats = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 6); // Last 7 days
    const days = eachDayOfInterval({ start, end });
    
    let activeDays = 0;
    let effort = 0;
    
    days.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const log = logs[dateStr];
      if (log) {
        let dailyEffort = 0;
        Object.values(log.habits).forEach(e => {
          dailyEffort += EFFORT_WEIGHTS[e];
        });
        if (dailyEffort > 0) {
          activeDays++;
          effort += dailyEffort;
        }
      }
    });

    return {
      activeDays,
      effort,
      consistency: Math.round((activeDays / 7) * 100)
    };
  }, [logs]);

  const identityMessage = useMemo(() => {
    if (stats.currentStreak >= 7) return "You are becoming someone who studies consistently. You showed up for your future self.";
    if (stats.currentStreak >= 3) return "You maintained your learning streak. You're building momentum.";
    if (stats.daysActive > 0) return "Every little bit counts. You acted like a learner today.";
    return "Start building your system today. The smallest effort matters.";
  }, [stats.currentStreak, stats.daysActive]);

  const getHeatmapColor = (score: number) => {
    if (score === 0) return 'bg-stone-100';
    if (score <= 2) return 'bg-indigo-200';
    if (score <= 5) return 'bg-indigo-400';
    return 'bg-indigo-600';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Identity Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Hello, Learner.</h2>
          <p className="text-indigo-100 text-lg font-medium">{identityMessage}</p>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0">
          <p className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-1">Daily Progress</p>
          <div className="text-3xl font-bold">{challengeCompletedToday ? '100%' : '50%'}</div>
        </div>
      </div>

      {/* Daily Challenge Card */}
      {!challengeCompletedToday ? (
        <div className="bg-white rounded-3xl border-2 border-indigo-100 shadow-md p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-indigo-300 transition-colors cursor-pointer" onClick={onStartChallenge}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent opacity-50"></div>
          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
              <Zap className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold text-stone-900">Daily Challenge</h3>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">+20 XP</span>
              </div>
              <p className="text-stone-500 font-medium text-lg">Sketch an object in 2 minutes.</p>
            </div>
          </div>
          <button 
            className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 shrink-0 relative z-10 group-hover:bg-indigo-700"
          >
            Start Challenge <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 rounded-3xl border-2 border-emerald-100 p-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-1">Momentum Mode Activated!</h3>
            <p className="text-emerald-700 text-lg font-medium">You've completed your daily challenge. Keep the streak going by logging your habits.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 py-2">
        <div className="h-px bg-stone-200 flex-1"></div>
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Today's Progress</h3>
        <div className="h-px bg-stone-200 flex-1"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl mb-2">
            <Flame className="w-8 h-8" />
          </div>
          <p className="text-3xl font-bold text-stone-900">{stats.currentStreak}</p>
          <p className="text-sm font-bold text-stone-400 uppercase tracking-wider">Current Streak</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl mb-2">
            <Target className="w-8 h-8" />
          </div>
          <p className="text-3xl font-bold text-stone-900">{stats.daysActive}</p>
          <p className="text-sm font-bold text-stone-400 uppercase tracking-wider">Days Active</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl mb-2">
            <TrendingUp className="w-8 h-8" />
          </div>
          <p className="text-3xl font-bold text-stone-900">{stats.totalEffort}</p>
          <p className="text-sm font-bold text-stone-400 uppercase tracking-wider">Total Effort</p>
        </div>
      </div>

      {/* Quick Action */}
      <div className={`bg-white p-8 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${challengeCompletedToday ? 'border-emerald-200 ring-4 ring-emerald-50' : 'border-stone-100 opacity-75'}`}>
        <div>
          <h3 className="text-2xl font-bold text-stone-900 mb-1">Log Today's Effort</h3>
          <p className="text-stone-500 font-medium text-lg">Record your habits for {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        <button 
          onClick={() => onDateSelect(today)}
          className="w-full md:w-auto px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <CalendarIcon className="w-5 h-5" />
          Log Today's Effort
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap */}
        <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-600" />
              Effort Heatmap
            </h3>
            <span className="text-sm font-bold text-stone-400 uppercase tracking-wider">Last 28 Days</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {heatmapDays.map((day, i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-md ${getHeatmapColor(day.score)} ${day.isToday ? 'ring-2 ring-offset-2 ring-indigo-600' : ''} transition-colors hover:opacity-80 cursor-help`}
                title={`${day.displayDate}: ${day.score} effort`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-6 text-sm font-medium text-stone-500 justify-end">
            <span>Less</span>
            <div className="w-4 h-4 rounded-sm bg-stone-100"></div>
            <div className="w-4 h-4 rounded-sm bg-indigo-200"></div>
            <div className="w-4 h-4 rounded-sm bg-indigo-400"></div>
            <div className="w-4 h-4 rounded-sm bg-indigo-600"></div>
            <span>More</span>
          </div>
        </div>

        {/* Weekly Progress Report */}
        <div className="bg-stone-900 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Weekly Report
          </h3>
          
          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-stone-400 text-sm font-bold uppercase tracking-wider mb-1">Consistency</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-white">{weeklyStats.consistency}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Active Days</p>
                <p className="text-2xl font-bold">{weeklyStats.activeDays}/7</p>
              </div>
              <div>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Effort Score</p>
                <p className="text-2xl font-bold">{weeklyStats.effort}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-800">
              <p className="text-emerald-400 font-medium flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                You improved +14% from last week
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
