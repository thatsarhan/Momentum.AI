import React, { useState } from 'react';
import { Habit } from '../types';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface HabitManagerProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

export function HabitManager({ habits, setHabits }: HabitManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Habit>>({});

  const handleAdd = () => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: 'New Habit',
      minimumDesc: '5 mins',
      mediumDesc: '20 mins',
      greatDesc: '1 hour',
    };
    setHabits([...habits, newHabit]);
    startEdit(newHabit);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this habit? Past logs will still retain the effort score but lose the habit name context.')) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const startEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setEditForm(habit);
  };

  const saveEdit = () => {
    if (!editForm.name?.trim()) return;
    setHabits(habits.map(h => h.id === editingId ? { ...h, ...editForm } as Habit : h));
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Habit Systems</h2>
          <p className="text-stone-500 mt-1">Define your daily habits and their effort levels.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Habit
        </button>
      </div>

      <div className="grid gap-4">
        {habits.map(habit => (
          <div key={habit.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            {editingId === habit.id ? (
              <div className="p-6 space-y-4 bg-stone-50/50">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Habit Name</label>
                  <input 
                    type="text" 
                    value={editForm.name || ''}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Sketching"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Bare Minimum</label>
                    <input 
                      type="text" 
                      value={editForm.minimumDesc || ''}
                      onChange={e => setEditForm({...editForm, minimumDesc: e.target.value})}
                      className="w-full p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 5 mins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-1">Okay Day (Medium)</label>
                    <input 
                      type="text" 
                      value={editForm.mediumDesc || ''}
                      onChange={e => setEditForm({...editForm, mediumDesc: e.target.value})}
                      className="w-full p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., 20 mins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">Great Day</label>
                    <input 
                      type="text" 
                      value={editForm.greatDesc || ''}
                      onChange={e => setEditForm({...editForm, greatDesc: e.target.value})}
                      className="w-full p-2.5 rounded-lg border border-purple-200 bg-purple-50/50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., 1 hour"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveEdit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-stone-900">{habit.name}</h3>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => startEdit(habit)}
                      className="p-2 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(habit.id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Minimum</p>
                    <p className="text-sm text-stone-700">{habit.minimumDesc}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Medium</p>
                    <p className="text-sm text-stone-700">{habit.mediumDesc}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-100">
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">Great</p>
                    <p className="text-sm text-stone-700">{habit.greatDesc}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {habits.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 border-dashed">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-stone-400" />
            </div>
            <h3 className="text-lg font-medium text-stone-900">No habits defined</h3>
            <p className="text-stone-500 mt-1">Create your first habit to start building momentum.</p>
            <button 
              onClick={handleAdd}
              className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Habit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
