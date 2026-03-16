import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, Users, Shield, ChevronUp, ChevronDown, Clock, UserPlus, Search, GraduationCap, Rocket, Target, Compass, Star, Sparkles, Crown } from 'lucide-react';

const BADGES = [
  { rank: 1, name: 'Visionary', color: 'text-blue-500', ribbon: 'bg-amber-500', icon: GraduationCap },
  { rank: 2, name: 'Master', color: 'text-cyan-400', ribbon: 'bg-amber-500', icon: Rocket },
  { rank: 3, name: 'Strategist', color: 'text-rose-500', ribbon: 'bg-amber-500', icon: Target },
  { rank: 4, name: 'Champion', color: 'text-orange-500', ribbon: 'bg-amber-500', icon: Trophy },
  { rank: 5, name: 'Adventurer', color: 'text-purple-500', ribbon: 'bg-amber-500', icon: Compass },
  { rank: 6, name: 'Expert', color: 'text-yellow-500', ribbon: 'bg-amber-500', icon: Star },
  { rank: 7, name: 'Explorer', color: 'text-fuchsia-400', ribbon: 'bg-amber-500', icon: Sparkles },
  { rank: 8, name: 'Achiever', color: 'text-lime-500', ribbon: 'bg-amber-500', icon: GraduationCap },
  { rank: 9, name: 'Apprentice', color: 'text-slate-700', ribbon: 'bg-amber-500', icon: Crown },
];

const SpecialBadge = ({ rank }: { rank: number }) => {
  const badge = BADGES.find(b => b.rank === rank);
  
  if (!badge) {
    return <div className="w-10 h-10 text-stone-400 flex items-center justify-center font-bold text-lg">{rank}</div>;
  }

  const Icon = badge.icon;

  return (
    <div className="relative flex flex-col items-center justify-center w-16 h-16 group mt-1" title={badge.name}>
      {/* Shield Background */}
      <svg viewBox="0 0 100 120" className={`w-12 h-14 drop-shadow-md ${badge.color}`} fill="currentColor">
        {/* Outer Shield */}
        <path d="M50 5 L10 20 L10 60 C10 95 50 115 50 115 C50 115 90 95 90 60 L90 20 Z" opacity="0.9" />
        {/* Inner Shield */}
        <path d="M50 12 L18 25 L18 60 C18 88 50 105 50 105 C50 105 82 88 82 60 L82 25 Z" fill="white" opacity="0.2" />
        {/* Right Half Shadow */}
        <path d="M50 5 L50 115 C50 115 90 95 90 60 L90 20 Z" fill="black" opacity="0.15" />
      </svg>
      
      {/* Icon */}
      <div className="absolute top-2.5 text-white drop-shadow-sm">
        <Icon size={20} strokeWidth={2.5} />
      </div>
      
      {/* Ribbon */}
      <div className={`absolute -bottom-2 ${badge.ribbon} text-white text-[8px] font-extrabold px-2 py-0.5 rounded shadow-md border-b-2 border-black/20 uppercase tracking-wider whitespace-nowrap z-10 flex items-center gap-1`}>
        <div className="w-0.5 h-0.5 rounded-full bg-white/50"></div>
        {badge.name}
        <div className="w-0.5 h-0.5 rounded-full bg-white/50"></div>
      </div>
    </div>
  );
};

// Mock data for the league
const LEAGUE_USERS = [
  { id: '1', name: 'Maya', xp: 1250, streak: 14, isCurrentUser: false },
  { id: '2', name: 'Arjun', xp: 1120, streak: 10, isCurrentUser: false },
  { id: '3', name: 'Sneha', xp: 980, streak: 8, isCurrentUser: false },
  { id: '4', name: 'Vikram', xp: 850, streak: 5, isCurrentUser: false },
  { id: '5', name: 'Priya', xp: 720, streak: 4, isCurrentUser: false },
  { id: '6', name: 'Rahul', xp: 640, streak: 3, isCurrentUser: false },
  { id: '7', name: 'Karan', xp: 510, streak: 2, isCurrentUser: false },
  { id: '8', name: 'Neha', xp: 420, streak: 1, isCurrentUser: false },
  { id: '9', name: 'Rohan', xp: 310, streak: 1, isCurrentUser: false },
  { id: '10', name: 'Aditi', xp: 150, streak: 0, isCurrentUser: false },
];

const INITIAL_FRIENDS = [
  { id: '1', name: 'Design Studio Team', isGroup: true, xp: 4500 },
  { id: '2', name: 'Priya', xp: 720, streak: 4, isCurrentUser: false },
  { id: '3', name: 'Rahul', xp: 640, streak: 3, isCurrentUser: false },
];

const REAL_STUDENTS: Record<string, { name: string, xp: number, streak: number }> = {
  'NID-7155': { name: 'Aarav Sharma', xp: 1450, streak: 12 },
  'NID-1234': { name: 'Priya Patel', xp: 890, streak: 5 },
  'NID-9999': { name: 'Rohan Gupta', xp: 2100, streak: 20 },
  'NID-4321': { name: 'Sneha Reddy', xp: 650, streak: 3 },
  'NID-5555': { name: 'Vikram Singh', xp: 1120, streak: 8 },
};

export function Leaderboard({ userXp, userStreak, userName, userId }: { userXp: number, userStreak: number, userName: string, userId: string }) {
  const [activeTab, setActiveTab] = useState<'league' | 'friends'>('league');
  const [friendsList, setFriendsList] = useState(INITIAL_FRIENDS);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [friendIdInput, setFriendIdInput] = useState('');

  // Insert current user into the league
  const allUsers = [...LEAGUE_USERS, { id: 'me', name: userName, xp: userXp, streak: userStreak, isCurrentUser: true }]
    .sort((a, b) => b.xp - a.xp);

  const currentUserRank = allUsers.findIndex(u => u.id === 'me') + 1;
  const isPromotionZone = currentUserRank <= 9;
  const isDemotionZone = currentUserRank >= allUsers.length - 2;

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    const id = friendIdInput.trim().toUpperCase();
    if (!id) return;

    if (id === userId) {
      alert("You cannot add yourself as a friend.");
      return;
    }

    if (friendsList.some(f => f.id === id)) {
      alert("This student is already in your friends list.");
      return;
    }

    const realStudent = REAL_STUDENTS[id];
    
    if (realStudent) {
      const newFriend = {
        id: id,
        name: realStudent.name,
        xp: realStudent.xp,
        streak: realStudent.streak,
        isCurrentUser: false
      };
      setFriendsList([...friendsList, newFriend]);
      setFriendIdInput('');
      setIsAddingFriend(false);
    } else {
      alert("Student not found. Please enter a valid NID student ID (e.g., NID-7155).");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-100 to-transparent opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Shield className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900">Gold League</h2>
          <p className="text-stone-500 mt-2 font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" /> 2 days left in this week
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-200/50 p-1 rounded-2xl w-full max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('league')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'league' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
        >
          Global League
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'friends' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
        >
          <Users className="w-4 h-4" /> Friends
        </button>
      </div>

      {/* Motivational Message */}
      {activeTab === 'league' && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
          <p className="text-indigo-700 font-bold">
            {isPromotionZone ? "🔥 You're in the promotion zone! Keep it up to reach Platinum League." :
             isDemotionZone ? "⚠️ You're at risk of demotion. Complete a daily challenge to move up!" :
             "💪 You're doing great! One more habit today can push you into the top 9."}
          </p>
        </div>
      )}

      {/* Add Friend Section */}
      {activeTab === 'friends' && (
        <div className="w-full">
          {!isAddingFriend ? (
            <button
              onClick={() => setIsAddingFriend(true)}
              className="w-full py-4 border-2 border-dashed border-stone-200 rounded-2xl text-stone-500 font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" /> Add Friend by Student ID
            </button>
          ) : (
            <form onSubmit={handleAddFriend} className="flex flex-col sm:flex-row gap-2 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Enter Student ID (e.g., NID-1234)"
                  value={friendIdInput}
                  onChange={(e) => setFriendIdInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-stone-900"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!friendIdInput.trim()}
                  className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingFriend(false)}
                  className="flex-1 sm:flex-none px-4 py-3 text-stone-500 font-bold hover:bg-stone-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Leaderboard List */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-100 grid grid-cols-[72px_1fr_80px_80px] gap-4 text-xs font-bold text-stone-400 uppercase tracking-wider text-center">
          <div>Rank</div>
          <div className="text-left">Learner</div>
          <div>XP</div>
          <div>Streak</div>
        </div>
        
        <div className="divide-y divide-stone-100">
          {(activeTab === 'league' ? allUsers : [...friendsList, { id: 'me', name: userName, xp: userXp, streak: userStreak, isCurrentUser: true }].sort((a, b) => b.xp - a.xp)).map((user, index) => {
            const rank = index + 1;
            const isTop9 = rank <= 9;
            const isBottom3 = activeTab === 'league' && rank >= allUsers.length - 2;
            
            return (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 grid grid-cols-[72px_1fr_80px_80px] gap-4 items-center transition-colors ${user.isCurrentUser ? 'bg-indigo-50/50' : 'hover:bg-stone-50'}`}
              >
                <div className="flex justify-center">
                  <SpecialBadge rank={rank} />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${user.isCurrentUser ? 'bg-indigo-600' : (user as any).isGroup ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                    {(user as any).isGroup ? <Users className="w-5 h-5" /> : user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-bold ${user.isCurrentUser ? 'text-indigo-900' : 'text-stone-900'}`}>
                      {user.name} {user.isCurrentUser && '(You)'}
                    </p>
                    {activeTab === 'league' && (
                      <p className="text-xs font-medium text-stone-500 flex items-center gap-1">
                        {isTop9 ? <><ChevronUp className="w-3 h-3 text-emerald-500" /> Promotion Zone</> :
                         isBottom3 ? <><ChevronDown className="w-3 h-3 text-red-500" /> Demotion Zone</> :
                         <span className="text-stone-400">- Safe Zone</span>}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-center font-bold text-stone-700">
                  {user.xp}
                </div>
                
                <div className="flex justify-center">
                  {user.streak !== undefined ? (
                    <div className={`flex items-center gap-1 font-bold text-sm px-2 py-1 rounded-lg ${user.streak > 0 ? 'bg-orange-50 text-orange-500' : 'text-stone-400'}`}>
                      <Flame className={`w-4 h-4 ${user.streak > 0 ? 'fill-current' : ''}`} />
                      {user.streak}
                    </div>
                  ) : (
                    <span className="text-stone-300">-</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
