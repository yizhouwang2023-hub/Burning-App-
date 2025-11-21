import React, { useState } from 'react';
import { generateWorkoutPlan } from '../services/geminiService';
import { WorkoutPlan } from '../types';
import { Sparkles, Calendar, Target, BarChart } from 'lucide-react';

const WorkoutPlanner: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [days, setDays] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;

    setIsLoading(true);
    const generatedPlan = await generateWorkoutPlan(goal, fitnessLevel, days);
    setPlan(generatedPlan);
    setIsLoading(false);
  };

  return (
    <div className="h-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
      
      {/* Input Form */}
      <div className="w-full md:w-1/3 space-y-6">
        <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
                AI Plan Generator
            </h2>
            
            <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Goal</label>
                    <input 
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g. Sub-20min 5k, Weight Loss"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fitness Level</label>
                    <select 
                        value={fitnessLevel}
                        onChange={(e) => setFitnessLevel(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Days / Week</label>
                    <div className="flex justify-between bg-slate-900 rounded-lg p-1 border border-slate-700">
                        {[1,2,3,4,5,6,7].map(d => (
                            <button
                                key={d}
                                type="button"
                                onClick={() => setDays(d)}
                                className={`w-8 h-8 rounded-md text-sm font-bold transition-all ${days === d ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center disabled:opacity-50"
                >
                    {isLoading ? (
                        <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>Generating...</span>
                    ) : (
                        "Generate Plan"
                    )}
                </button>
            </form>
        </div>

        <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-lime-900/20 to-slate-900 border-lime-500/20">
            <h3 className="font-bold text-lime-400 mb-2">Pro Tip</h3>
            <p className="text-sm text-slate-400">
                Your PulseBeat earphones will audibly guide you through each interval of these workouts, announcing pace targets and heart rate warnings.
            </p>
        </div>
      </div>

      {/* Results View */}
      <div className="w-full md:w-2/3">
        {!plan && !isLoading && (
             <div className="h-full flex flex-col items-center justify-center text-slate-600 p-12 border-2 border-dashed border-slate-800 rounded-2xl">
                 <Target className="w-16 h-16 mb-4 opacity-50" />
                 <p className="text-lg">Enter your goals to receive a custom AI coaching plan.</p>
             </div>
        )}

        {isLoading && (
             <div className="h-full flex flex-col items-center justify-center">
                 <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                 <p className="text-purple-300 animate-pulse">Consulting Gemini Coach...</p>
             </div>
        )}

        {plan && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                <header className="glass-panel p-6 rounded-2xl border-l-4 border-l-purple-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">{plan.title}</h2>
                            <p className="text-slate-400">{plan.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/50">
                            {plan.difficulty} • {plan.durationWeeks} Weeks
                        </span>
                    </div>
                </header>

                <div className="grid gap-6">
                    {plan.schedule.map((week) => (
                        <div key={week.week} className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-300 flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                                Week {week.week}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {week.days.map((day, idx) => (
                                    <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-purple-400 uppercase">{day.day}</span>
                                            <span className="text-xs text-slate-500 flex items-center">
                                                <BarChart className="w-3 h-3 mr-1" />
                                                {day.durationMin} min
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{day.activity}</h4>
                                        <p className="text-sm text-slate-400">{day.focus}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanner;