import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Lock, Play, Trophy, Flame, Clock, Star, ArrowRight, BookOpen } from 'lucide-react';

const LEADERBOARD = [
  { name: 'Priya', xp: 2450, streak: 32 },
  { name: 'Rahul', xp: 2100, streak: 28 },
  { name: 'Sneha', xp: 1150, streak: 12 },
  { name: 'Vikram', xp: 900, streak: 5 },
  { name: 'Arhan', xp: 850, streak: 4 },
];

const LESSON_DATA = [
  { title: 'Introduction to Perspective', type: 'drawing', xp: 150, time: '15m', difficulty: 'Beginner', skills: ['1-Point Perspective', 'Line Weight'] },
  { title: 'Basic Geometric Forms', type: 'quiz', xp: 100, time: '10m', difficulty: 'Beginner', skills: ['Form Analysis', 'Spatial Reasoning'] },
  { title: 'Cubes and Cylinders', type: 'drawing', xp: 200, time: '25m', difficulty: 'Intermediate', skills: ['Constructing Forms', 'Proportions'] },
  { title: 'Complex Intersections', type: 'drawing', xp: 250, time: '30m', difficulty: 'Advanced', skills: ['Boolean Operations', 'Visualization'] },
  { title: 'Light and Shadow Basics', type: 'quiz', xp: 100, time: '10m', difficulty: 'Beginner', skills: ['Value Scales', 'Light Sources'] },
  { title: 'Rendering Surfaces', type: 'drawing', xp: 200, time: '20m', difficulty: 'Intermediate', skills: ['Texture', 'Materiality'] },
  { title: 'Product Sketching', type: 'drawing', xp: 300, time: '45m', difficulty: 'Advanced', skills: ['Ideation', 'Presentation'] },
  { title: 'Human Proportions', type: 'quiz', xp: 150, time: '15m', difficulty: 'Intermediate', skills: ['Anatomy', 'Gesture'] },
  { title: 'Figure Drawing', type: 'drawing', xp: 250, time: '30m', difficulty: 'Advanced', skills: ['Dynamic Poses', 'Foreshortening'] },
  { title: 'Composition Masterclass', type: 'drawing', xp: 350, time: '60m', difficulty: 'Expert', skills: ['Rule of Thirds', 'Visual Hierarchy'] },
];

export function Roadmap({ userLevel, onSelectNode }: { userLevel: number, onSelectNode: (type: string) => void }) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const nodes = Array.from({ length: 10 }).map((_, i) => {
    const level = i + 1;
    let status: 'completed' | 'current' | 'locked' = 'locked';
    if (level < userLevel) status = 'completed';
    else if (level === userLevel) status = 'current';

    const data = LESSON_DATA[i] || LESSON_DATA[0];

    return {
      id: level.toString(),
      ...data,
      level,
      status
    };
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto">
      {/* Roadmap Path */}
      <div className="flex-1 w-full bg-white rounded-3xl border border-stone-200 shadow-sm p-6 md:p-10 relative">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-stone-900">Learning Path</h2>
          <p className="text-stone-500 mt-2 text-lg">Master NID concepts step-by-step</p>
        </div>

        <div className="relative space-y-6">
          {/* Vertical Line */}
          <div className="absolute left-8 top-8 bottom-8 w-1 bg-stone-100 rounded-full hidden md:block"></div>
          <div 
            className="absolute left-8 top-8 w-1 bg-indigo-500 rounded-full hidden md:block transition-all duration-1000"
            style={{ height: `${Math.min((userLevel - 1) * 10 + 5, 100)}%` }}
          ></div>

          {nodes.map((node, i) => {
            const isCurrent = node.status === 'current';
            const isCompleted = node.status === 'completed';
            const isLocked = node.status === 'locked';

            return (
              <div 
                key={node.id}
                className="relative flex flex-col md:flex-row items-start md:items-center gap-6 group"
                onMouseEnter={() => setHoveredNode(i)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node Icon */}
                <div className="relative z-10 shrink-0">
                  <button
                    onClick={() => (isCurrent || isCompleted) && onSelectNode(node.type)}
                    disabled={isLocked}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 ${
                      isCompleted ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-200 hover:bg-emerald-200' :
                      isCurrent ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-xl hover:scale-105 hover:bg-indigo-700' :
                      'bg-stone-50 text-stone-400 border-2 border-stone-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-8 h-8" /> :
                     isCurrent ? <Play className="w-8 h-8 ml-1" /> :
                     <Lock className="w-6 h-6" />}
                  </button>
                  
                  {isCurrent && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
                    </span>
                  )}
                </div>

                {/* Node Content */}
                <div className={`flex-1 bg-white border-2 rounded-2xl p-6 transition-all duration-300 ${
                  isCurrent ? 'border-indigo-200 shadow-md ring-4 ring-indigo-50' :
                  isCompleted ? 'border-stone-200 opacity-75' :
                  'border-stone-100 opacity-50 bg-stone-50'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-stone-400 uppercase tracking-wider">Lesson {node.level}</span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                          node.type === 'drawing' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {node.type}
                        </span>
                      </div>
                      <h3 className={`text-xl font-bold ${isLocked ? 'text-stone-500' : 'text-stone-900'}`}>
                        {node.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm font-medium text-stone-500">
                      <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500" /> {node.xp} XP
                      </div>
                      <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-lg">
                        <Clock className="w-4 h-4" /> {node.time}
                      </div>
                    </div>
                  </div>

                  {/* Hover Details */}
                  <AnimatePresence>
                    {hoveredNode === i && !isLocked && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-stone-100 flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-2">Skills Learned</p>
                            <div className="flex flex-wrap gap-2">
                              {node.skills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button 
                            onClick={() => onSelectNode(node.type)}
                            className="shrink-0 px-6 py-2 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors flex items-center gap-2"
                          >
                            {isCompleted ? 'Review Lesson' : 'Start Lesson'} <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Leaderboard */}
      <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-8 space-y-6">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center shadow-inner">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-stone-900 text-xl">Top 5 Students</h3>
          </div>
          
          <div className="space-y-3">
            {LEADERBOARD.map((student, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === 0 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' :
                  idx === 1 ? 'bg-stone-200 text-stone-700' :
                  idx === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-stone-100 text-stone-500'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-stone-900">{student.name}</p>
                  <p className="text-xs text-stone-500 font-medium">{student.xp} XP</p>
                </div>
                <div className="flex items-center gap-1 text-orange-500 font-bold text-sm bg-orange-50 px-2 py-1 rounded-lg">
                  <Flame className="w-4 h-4" /> {student.streak}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-lg p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="relative z-10">
            <h4 className="font-bold text-2xl mb-2">Keep the Momentum!</h4>
            <p className="text-indigo-100 font-medium mb-6">Complete your daily tasks to climb the leaderboard.</p>
            <div className="w-full py-4 bg-white/20 rounded-2xl font-bold text-lg backdrop-blur-sm border border-white/20">
              Current Level: {userLevel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
