import React, { useState, useRef, useEffect } from 'react';
import { chatWithMentor } from '../lib/gemini';
import { Send, Bot, User, Loader2, Mic, MicOff } from 'lucide-react';
import { motion } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export function AIMentor() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Hello! I am Midhun AI, your personal NID Mentor. I can help you with design thinking, critique your ideas, or explain complex concepts. What would you like to discuss today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithMentor(userMsg.content, messages);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: response }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: `Error: ${error.message || 'Failed to connect. Please try again.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceMode = () => {
    if (!isVoiceActive) {
      alert("Live API Voice mode activated! (Note: Full PCM audio streaming requires backend setup, but you can use this interface to simulate voice interactions with Gemini 2.5 Native Audio).");
    }
    setIsVoiceActive(!isVoiceActive);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-stone-900">Midhun AI</h2>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Online
            </p>
          </div>
        </div>
        <button 
          onClick={toggleVoiceMode}
          className={`p-2 rounded-full transition-colors ${isVoiceActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'text-stone-400 hover:text-indigo-600 hover:bg-indigo-50'}`} 
          title="Start Voice Call (Live API)"
        >
          {isVoiceActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/30">
        {isVoiceActive && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center absolute inset-0 animate-ping opacity-75"></div>
              <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center relative z-10 shadow-xl">
                <Mic className="w-10 h-10" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-stone-900">Listening...</h3>
              <p className="text-stone-500 mt-2">Speak your design question clearly.</p>
            </div>
          </div>
        )}

        {!isVoiceActive && messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-stone-900 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-stone-900 text-white rounded-tr-sm' : 'bg-white border border-stone-200 shadow-sm rounded-tl-sm'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {!isVoiceActive && isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 bg-white border border-stone-200 shadow-sm rounded-2xl rounded-tl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-sm text-stone-500">Generating response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!isVoiceActive && (
        <div className="p-4 bg-white border-t border-stone-100 flex flex-col gap-3">
          {/* Suggestion Chips */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 px-2">
              {['Explain perspective', 'Give sketch critique', 'Design thinking question'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-indigo-50 text-stone-600 hover:text-indigo-700 text-xs font-medium rounded-full transition-colors border border-stone-200 hover:border-indigo-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-full p-1 pr-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about perspective, design history, or critique..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
