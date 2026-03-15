import React, { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Roadmap } from './pages/Roadmap';
import { QuizEngine } from './pages/QuizEngine';
import { DrawingStudio } from './pages/DrawingStudio';
import { AIMentor } from './pages/AIMentor';
import { HabitManager } from './pages/HabitManager';
import { DailyChallenge } from './pages/DailyChallenge';
import { Leaderboard } from './pages/Leaderboard';
import { HabitLoggerModal } from './components/HabitLoggerModal';
import { Habit, DailyLog, UserProfile } from './types';
import { LayoutDashboard, Map, BrainCircuit, PenTool, MessageSquare, ListTodo, Flame, Trophy, CheckCircle2, Copy, Check, Settings, LogOut, Download, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

const DEFAULT_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Design Practice',
    minimumDesc: 'Sketch for 5 mins',
    mediumDesc: 'Sketch for 20 mins',
    greatDesc: 'Complete a full design exercise (1 hr)',
  },
  {
    id: '2',
    name: 'Reading',
    minimumDesc: 'Read 1 page',
    mediumDesc: 'Read 1 chapter',
    greatDesc: 'Read for 45 mins',
  }
];

function LandingPage({ onStart, onLogin }: { onStart: (name: string) => void, onLogin: (id: string, name: string) => void }) {
  const [mode, setMode] = useState<'new' | 'returning' | 'generated'>('new');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    const newId = `NID-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedId(newId);
    setMode('generated');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogin = () => {
    if (!name.trim() || !studentId.trim()) return;
    onLogin(studentId.trim(), name.trim());
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-stone-100 p-8 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3">
          <span className="text-white font-bold text-5xl -rotate-3">M</span>
        </div>
        
        {mode === 'new' && (
          <>
            <div>
              <h1 className="text-4xl font-bold text-stone-900 tracking-tight">Momentum</h1>
              <p className="text-stone-500 mt-3 text-lg leading-relaxed">
                Your personalized NID preparation journey.
              </p>
            </div>
            
            <div className="space-y-4 pt-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                className="w-full px-4 py-4 rounded-2xl border-2 border-stone-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-center text-lg font-medium transition-all"
              />
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 disabled:opacity-50 transition-colors shadow-md"
              >
                Create Student ID
              </button>
              <button 
                onClick={() => setMode('returning')}
                className="text-stone-500 font-bold hover:text-indigo-600 transition-colors"
              >
                Already have an ID? Log in
              </button>
            </div>
          </>
        )}

        {mode === 'generated' && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Welcome, {name}!</h2>
              <p className="text-stone-500 mt-2 font-medium">This ID will be your password. Save it safely.</p>
            </div>

            <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl p-6 relative">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Your Student ID</p>
              <p className="text-3xl font-bold text-indigo-600 tracking-widest">{generatedId}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCopy}
                className="w-full py-4 bg-stone-100 text-stone-900 rounded-2xl font-bold text-lg hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
              >
                {copied ? <><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Copied!</> : <><Copy className="w-5 h-5" /> Copy ID</>}
              </button>
              <button
                onClick={() => onStart(name.trim())}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {mode === 'returning' && (
          <div className="space-y-6 animate-in slide-in-from-left-8 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Welcome Back</h2>
              <p className="text-stone-500 mt-2 font-medium">Enter your details to continue.</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl border-2 border-stone-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-center text-lg font-medium transition-all"
              />
              <input
                type="text"
                placeholder="Student ID (e.g., NID-1234)"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-4 rounded-2xl border-2 border-stone-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-center text-lg font-medium transition-all uppercase"
              />
              <button
                onClick={handleLogin}
                disabled={!name.trim() || !studentId.trim()}
                className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 disabled:opacity-50 transition-colors shadow-md"
              >
                Log In
              </button>
              <button 
                onClick={() => setMode('new')}
                className="text-stone-500 font-bold hover:text-indigo-600 transition-colors"
              >
                Create a new Student ID
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('momentum_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('momentum_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [logs, setLogs] = useState<Record<string, DailyLog>>(() => {
    const saved = localStorage.getItem('momentum_logs');
    return saved ? JSON.parse(saved) : {};
  });

  const [lastChallengeDate, setLastChallengeDate] = useState<string | null>(() => {
    return localStorage.getItem('momentum_last_challenge');
  });

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'roadmap' | 'quiz' | 'drawing' | 'mentor' | 'habits' | 'daily-challenge' | 'leaderboard'>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showStreakAnim, setShowStreakAnim] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const challengeCompletedToday = lastChallengeDate === todayStr;

  useEffect(() => {
    if (user) {
      localStorage.setItem('momentum_user', JSON.stringify(user));
    }
    localStorage.setItem('momentum_habits', JSON.stringify(habits));
    localStorage.setItem('momentum_logs', JSON.stringify(logs));
    if (lastChallengeDate) {
      localStorage.setItem('momentum_last_challenge', lastChallengeDate);
    }
  }, [user, habits, logs, lastChallengeDate]);

  const handleStart = (name: string) => {
    setUser({
      id: `NID-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      xp: 0,
      streak: 0,
      lastActive: new Date().toISOString(),
      roadmapLevel: 1
    });
  };

  const handleLogin = (id: string, name: string) => {
    // In a real app, this would fetch from a database.
    // Here we just mock a successful login with the provided ID and name.
    setUser({
      id,
      name,
      xp: 0,
      streak: 0,
      lastActive: new Date().toISOString(),
      roadmapLevel: 1
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('momentum_user');
    setUser(null);
  };

  const handleBackup = () => {
    const backupData = {
      user,
      habits,
      logs,
      lastChallengeDate
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `momentum_backup_${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveLog = (log: DailyLog, xpGained: number) => {
    setLogs(prev => ({ ...prev, [log.date]: log }));
    setSelectedDate(null);
    
    if (xpGained > 0) {
      handleTaskComplete(xpGained, true); // Use isDailyChallenge=true to avoid advancing roadmap
    }
  };

  const handleTaskComplete = (xp: number, isDailyChallenge = false) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        xp: prev.xp + xp,
        streak: prev.streak + 1,
        roadmapLevel: isDailyChallenge ? prev.roadmapLevel : prev.roadmapLevel + 1
      };
    });

    if (isDailyChallenge) {
      setLastChallengeDate(todayStr);
    }
    
    // Show streak animation/alert
    setShowStreakAnim(true);
    setTimeout(() => setShowStreakAnim(false), 3000);
    
    setCurrentTab(isDailyChallenge ? 'dashboard' : 'roadmap');
  };

  const handleSelectNode = (type: string) => {
    if (type === 'quiz') setCurrentTab('quiz');
    if (type === 'drawing') setCurrentTab('drawing');
  };

  const handleCopyId = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (!user) {
    return <LandingPage onStart={handleStart} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col md:flex-row relative">
      {/* Streak Animation Overlay */}
      {showStreakAnim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <Flame className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-stone-900">Task Complete!</h2>
            <p className="text-xl font-medium text-orange-500 mt-2">🔥 Streak increased to {user.streak}!</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-stone-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-stone-100">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-600 flex items-center gap-2 mb-8">
            <span className="bg-indigo-600 text-white p-1.5 rounded-xl shadow-sm">
              <span className="font-bold text-sm leading-none block">M</span>
            </span>
            Momentum
          </h1>
          
          {/* User Profile & Progress Ring */}
          <div className="flex flex-col items-center mb-6 relative">
            <div className="relative w-20 h-20 mb-3">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#f5f5f4" strokeWidth="8" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="#4f46e5" strokeWidth="8" strokeDasharray={`${(user.xp % 1000) / 1000 * 289} 289`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-1.5 bg-stone-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                <span className="text-2xl font-bold text-stone-400">{user.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            
            <h2 className="font-bold text-stone-900 text-lg mt-2">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
              <span className="font-mono text-xs font-bold text-indigo-600">{user.id}</span>
              <button onClick={handleCopyId} className="text-stone-400 hover:text-indigo-600 transition-colors" title="Copy ID">
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mt-2">Level {Math.floor(user.xp / 1000) + 1} Designer</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="bg-stone-50 rounded-xl p-3 text-center border border-stone-100">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Total XP</div>
              <div className="font-bold text-stone-900">{user.xp}</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-100">
              <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">Streak</div>
              <div className="font-bold text-orange-600 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4" /> {user.streak}
              </div>
            </div>
          </div>

          {/* Today's Momentum Checklist */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Today's Momentum</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${challengeCompletedToday ? 'text-emerald-500' : 'text-stone-300'}`} />
                <span className={`text-sm font-medium ${challengeCompletedToday ? 'text-stone-900' : 'text-stone-500'}`}>Daily Challenge</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${logs[todayStr] ? 'text-emerald-500' : 'text-stone-300'}`} />
                <span className={`text-sm font-medium ${logs[todayStr] ? 'text-stone-900' : 'text-stone-500'}`}>Habits Logged</span>
              </div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} />
          <NavItem icon={<Map />} label="Roadmap" active={currentTab === 'roadmap'} onClick={() => setCurrentTab('roadmap')} />
          <NavItem icon={<Trophy />} label="Leaderboard" active={currentTab === 'leaderboard'} onClick={() => setCurrentTab('leaderboard')} />
          <NavItem icon={<BrainCircuit />} label="Daily Quiz" active={currentTab === 'quiz'} onClick={() => setCurrentTab('quiz')} />
          <NavItem icon={<PenTool />} label="Drawing Studio" active={currentTab === 'drawing'} onClick={() => setCurrentTab('drawing')} />
          <NavItem icon={<MessageSquare />} label="Midhun AI" active={currentTab === 'mentor'} onClick={() => setCurrentTab('mentor')} />
          <div className="my-4 border-t border-stone-100"></div>
          <NavItem icon={<ListTodo />} label="Habits Setup" active={currentTab === 'habits'} onClick={() => setCurrentTab('habits')} />
        </nav>

        <div className="p-4 border-t border-stone-100 space-y-1 bg-stone-50/50">
          <button 
            onClick={handleBackup}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-indigo-600 transition-colors"
          >
            <Download className="w-5 h-5" /> Backup Data
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {currentTab === 'dashboard' && (
            <Dashboard 
              habits={habits} 
              logs={logs} 
              onDateSelect={setSelectedDate} 
              onStartChallenge={() => setCurrentTab('daily-challenge')}
              challengeCompletedToday={challengeCompletedToday}
            />
          )}
          {currentTab === 'daily-challenge' && (
            <DailyChallenge 
              onComplete={(xp) => handleTaskComplete(xp, true)} 
              currentStreak={user.streak} 
            />
          )}
          {currentTab === 'leaderboard' && (
            <Leaderboard 
              userXp={user.xp} 
              userStreak={user.streak} 
              userName={user.name} 
              userId={user.id}
            />
          )}
          {currentTab === 'roadmap' && <Roadmap userLevel={user.roadmapLevel} onSelectNode={handleSelectNode} />}
          {currentTab === 'quiz' && <QuizEngine userLevel={user.roadmapLevel} onComplete={(xp) => handleTaskComplete(xp, false)} />}
          {currentTab === 'drawing' && <DrawingStudio onComplete={(xp) => handleTaskComplete(xp, false)} />}
          {currentTab === 'mentor' && <AIMentor />}
          {currentTab === 'habits' && <HabitManager habits={habits} setHabits={setHabits} />}
        </div>
      </main>

      {/* Habit Logger Modal */}
      {selectedDate && (
        <HabitLoggerModal
          date={selectedDate}
          habits={habits}
          existingLog={logs[selectedDate]}
          onClose={() => setSelectedDate(null)}
          onSave={handleSaveLog}
        />
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-indigo-50 text-indigo-700' : 'text-stone-600 hover:bg-stone-100'}`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      {label}
    </button>
  );
}
