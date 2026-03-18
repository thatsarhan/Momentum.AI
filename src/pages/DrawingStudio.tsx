import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, CheckCircle2, Upload, Maximize2, Image as ImageIcon, Sparkles, Loader2, Circle, Flame, Lock } from 'lucide-react';
import { getGeminiClient } from '../lib/gemini';

const TUTORIALS = [
  {
    id: '1',
    title: 'Drawing Basics 1',
    youtubeUrl: 'https://www.youtube.com/embed/videoseries?list=PL-i_GDP6hCKlHXwGiguwu5z3xtYPhjrQK',
    category: 'Fundamentals',
    duration: 'Playlist',
    xp: 100,
    practiceTask: 'Complete the exercises from the first 3 videos in this playlist.',
    steps: [
      'Watch the video lessons',
      'Practice the basic strokes',
      'Upload your practice sheet'
    ]
  },
  {
    id: '2',
    title: 'Value of Shading',
    youtubeUrl: 'https://www.youtube.com/embed/videoseries?list=PLXkHosWORUv4AaKyiQjyF6SK87uv0ZCUx',
    category: 'Shading',
    duration: 'Playlist',
    xp: 150,
    practiceTask: 'Create a 5-value shading scale and apply it to a sphere.',
    steps: [
      'Watch the shading techniques',
      'Create a value scale',
      'Shade a basic 3D form',
      'Upload your shaded drawing'
    ]
  },
  {
    id: '3',
    title: 'Drawing Basics 2',
    youtubeUrl: 'https://www.youtube.com/embed/videoseries?list=PL1HIh25sbqZnkA1T09UtVHoyjYaMJuK0a',
    category: 'Fundamentals',
    duration: 'Playlist',
    xp: 100,
    practiceTask: 'Draw 5 different objects from your desk using basic shapes.',
    steps: [
      'Watch the basic drawing videos',
      'Break down objects into shapes',
      'Upload your sketches'
    ]
  },
  {
    id: '4',
    title: 'Perspective Learning',
    youtubeUrl: 'https://www.youtube.com/embed/videoseries?list=PLzX9r5YIcHzsmPpZ6RZGROR5AZ7b5rgzv',
    category: 'Perspective',
    duration: 'Playlist',
    xp: 200,
    practiceTask: 'Draw a cityscape using 2-point perspective.',
    steps: [
      'Watch the perspective lessons',
      'Set up vanishing points',
      'Draw the cityscape',
      'Upload your perspective drawing'
    ]
  },
  {
    id: '5',
    title: 'More Drawing Basics',
    youtubeUrl: 'https://www.youtube.com/embed/videoseries?list=PL0V_JTTg_6bZ23v9p6I7cMCyKRacI2SfQ',
    category: 'Fundamentals',
    duration: 'Playlist',
    xp: 100,
    practiceTask: 'Follow along with the basic exercises and fill a page with sketches.',
    steps: [
      'Watch the foundational videos',
      'Fill a sketchbook page',
      'Upload your page'
    ]
  }
];

export function DrawingStudio({ onComplete }: { onComplete: (xp: number) => void }) {
  const [activeTutorialId, setActiveTutorialId] = useState(() => {
    return localStorage.getItem('momentum_active_tutorial') || TUTORIALS[0].id;
  });
  
  const activeTutorial = TUTORIALS.find(t => t.id === activeTutorialId) || TUTORIALS[0];

  const [completedStepsMap, setCompletedStepsMap] = useState<Record<string, number[]>>(() => {
    const saved = localStorage.getItem('momentum_tutorial_steps');
    return saved ? JSON.parse(saved) : {};
  });

  const [completedTutorials, setCompletedTutorials] = useState<string[]>(() => {
    const saved = localStorage.getItem('momentum_completed_tutorials');
    return saved ? JSON.parse(saved) : [];
  });

  const completedSteps = completedStepsMap[activeTutorial.id] || [];
  const uploaded = completedTutorials.includes(activeTutorial.id);
  
  // AI Reference Generator State
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('momentum_active_tutorial', activeTutorialId);
  }, [activeTutorialId]);

  useEffect(() => {
    localStorage.setItem('momentum_tutorial_steps', JSON.stringify(completedStepsMap));
  }, [completedStepsMap]);

  useEffect(() => {
    localStorage.setItem('momentum_completed_tutorials', JSON.stringify(completedTutorials));
  }, [completedTutorials]);

  const toggleStep = (index: number) => {
    setCompletedStepsMap(prev => {
      const current = prev[activeTutorial.id] || [];
      if (current.includes(index)) {
        return { ...prev, [activeTutorial.id]: current.filter(i => i !== index) };
      } else {
        return { ...prev, [activeTutorial.id]: [...current, index] };
      }
    });
  };

  const handleUpload = () => {
    if (uploaded) return;

    // Mark tutorial as completed
    setCompletedTutorials(prev => [...prev, activeTutorial.id]);
    
    // Ensure the last step (usually upload) is checked
    const lastStepIndex = activeTutorial.steps.length - 1;
    setCompletedStepsMap(prev => {
      const current = prev[activeTutorial.id] || [];
      if (!current.includes(lastStepIndex)) {
        return { ...prev, [activeTutorial.id]: [...current, lastStepIndex] };
      }
      return prev;
    });

    // Simulate upload delay and auto-advance
    setTimeout(() => {
      onComplete(activeTutorial.xp);
      
      // Auto-advance to next tutorial
      const currentIndex = TUTORIALS.findIndex(t => t.id === activeTutorial.id);
      if (currentIndex < TUTORIALS.length - 1) {
        setActiveTutorialId(TUTORIALS[currentIndex + 1].id);
      }
    }, 2000);
  };

  const handleGenerateReference = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenError(null);
    setGeneratedImage(null);

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setGeneratedImage(`data:image/png;base64,${base64EncodeString}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("No image returned from the model.");
      }

    } catch (error) {
      console.error("Image generation failed:", error);
      setGenError("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTutorialChange = (tutorialId: string) => {
    setActiveTutorialId(tutorialId);
  };

  const progressPercentage = Math.round((completedSteps.length / activeTutorial.steps.length) * 100);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Learning Workspace */}
        <div className="flex-1 space-y-8">
          
          {/* Lesson Header */}
          <div>
            <h1 className="text-4xl font-bold text-stone-900 tracking-tight">{activeTutorial.title}</h1>
            <div className="flex items-center gap-3 mt-4 text-sm font-bold text-stone-500">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg uppercase tracking-wider text-xs">{activeTutorial.category}</span>
              <span>•</span>
              <span>{activeTutorial.duration}</span>
              <span>•</span>
              <span className="text-orange-500 flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-md"><Flame className="w-4 h-4" /> +{activeTutorial.xp} XP</span>
            </div>
          </div>

          {/* Video Player */}
          <div className="aspect-video bg-stone-900 rounded-3xl overflow-hidden shadow-md relative border border-stone-200">
             <iframe 
                width="100%" 
                height="100%" 
                src={`${activeTutorial.youtubeUrl}&autoplay=1&rel=0`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
          </div>

          {/* Practice Canvas Area */}
          <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-stone-900 mb-3">Practice Task</h2>
            <p className="text-stone-600 mb-8 text-lg">{activeTutorial.practiceTask}</p>

            {/* Upload Area */}
            {!uploaded ? (
              <div 
                onClick={handleUpload}
                className="border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center hover:bg-stone-50 hover:border-indigo-400 transition-all cursor-pointer group"
              >
                <div className="w-20 h-20 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  <Upload className="w-10 h-10" />
                </div>
                <p className="font-bold text-stone-900 text-xl mb-2">Upload your sketch</p>
                <p className="text-stone-500 font-medium">Drag and drop or click to browse</p>
                <p className="text-xs text-stone-400 mt-2 font-medium">JPEG, PNG up to 5MB</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-center shadow-sm"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <p className="font-bold text-2xl mb-2">Sketch Uploaded Successfully!</p>
                <p className="text-emerald-700 font-medium text-lg">+{activeTutorial.xp} XP Earned. Great job!</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Progress & Mission */}
        <div className="w-full lg:w-96 space-y-8 shrink-0">
          
          {/* Course Selection */}
          <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
            <h3 className="font-bold text-stone-900 mb-4 text-xl">Course Modules</h3>
            <div className="space-y-2">
              {TUTORIALS.map((tutorial) => (
                <button
                  key={tutorial.id}
                  onClick={() => handleTutorialChange(tutorial.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${
                    activeTutorial.id === tutorial.id 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <span className="truncate pr-2">{tutorial.title}</span>
                  {activeTutorial.id === tutorial.id && <Play className="w-4 h-4 shrink-0 fill-current" />}
                </button>
              ))}
            </div>
          </div>

          {/* Mission Progress Tracker */}
          <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
            <h3 className="font-bold text-stone-900 mb-6 text-xl">Mission Progress</h3>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                <span>{completedSteps.length}/{activeTutorial.steps.length} completed</span>
                <span className="text-indigo-600">{progressPercentage}%</span>
              </div>
              <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-600 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Checkable Steps */}
            <div className="space-y-3">
              {activeTutorial.steps.map((step, idx) => {
                const isCompleted = completedSteps.includes(idx);
                return (
                  <button 
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-colors border ${isCompleted ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-stone-100 hover:border-stone-200 hover:bg-stone-50'}`}
                  >
                    <div className={`mt-0.5 shrink-0 ${isCompleted ? 'text-indigo-600' : 'text-stone-300'}`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                    </div>
                    <span className={`text-sm font-medium ${isCompleted ? 'text-stone-500 line-through decoration-stone-300' : 'text-stone-700'}`}>
                      {step}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contextual AI Reference Helper */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-indigo-900 text-lg">AI Reference</h3>
            </div>
            <p className="text-sm text-indigo-700/80 mb-6 font-medium">Generate a quick AI reference image to guide your sketch.</p>
            
            <div className="flex flex-col gap-3">
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A cube in 1-point perspective..."
                className="w-full bg-white border border-indigo-200 rounded-xl p-4 text-sm text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
              <button 
                onClick={handleGenerateReference}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-4 px-6 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Generating</>
                ) : (
                  <><ImageIcon className="w-5 h-5" /> Generate Image</>
                )}
              </button>
            </div>

            {genError && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                {genError}
              </div>
            )}

            {generatedImage && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-indigo-100 relative group bg-white shadow-sm">
                <img src={generatedImage} alt="AI Generated Reference" className="w-full h-auto" />
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <button className="bg-white text-stone-900 p-4 rounded-full hover:scale-105 transition-transform shadow-lg">
                    <Maximize2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
