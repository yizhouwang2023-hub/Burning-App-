import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const data = [
  { name: 'Mon', hr: 140, pace: 6.5, dist: 5 },
  { name: 'Tue', hr: 135, pace: 7.0, dist: 3 },
  { name: 'Wed', hr: 155, pace: 5.8, dist: 8 },
  { name: 'Thu', hr: 0, pace: 0, dist: 0 },
  { name: 'Fri', hr: 148, pace: 6.2, dist: 6 },
  { name: 'Sat', hr: 160, pace: 5.5, dist: 12 },
  { name: 'Sun', hr: 130, pace: 7.5, dist: 4 },
];

const Analysis: React.FC = () => {
  return (
    <div className="h-full max-w-6xl mx-auto p-4 md:p-8 space-y-6 overflow-y-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heart Rate Trend */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Heart Rate Intensity</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} domain={[60, 200]} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#f43f5e' }}
                            />
                            <Line type="monotone" dataKey="hr" stroke="#f43f5e" strokeWidth={3} dot={{r: 4, fill: '#f43f5e'}} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Volume */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Weekly Volume (KM)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip 
                                cursor={{fill: '#334155', opacity: 0.4}}
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#84cc16' }}
                            />
                            <Bar dataKey="dist" fill="#84cc16" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Comparison / Pace Analysis */}
        <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Pace vs. Fatigue</h3>
            <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis yAxisId="left" stroke="#22d3ee" fontSize={12} orientation="left" label={{ value: 'Pace (min/km)', angle: -90, position: 'insideLeft', fill:'#22d3ee' }} />
                        <YAxis yAxisId="right" stroke="#f43f5e" fontSize={12} orientation="right" label={{ value: 'Avg HR', angle: 90, position: 'insideRight', fill:'#f43f5e' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="pace" stroke="#22d3ee" name="Pace" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="hr" stroke="#f43f5e" name="Heart Rate" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
                <p className="text-slate-400 text-sm mb-1">Weekly Total</p>
                <p className="text-2xl font-bold text-white">38.0 km</p>
             </div>
             <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
                <p className="text-slate-400 text-sm mb-1">Avg Pace</p>
                <p className="text-2xl font-bold text-cyan-400">6:15 /km</p>
             </div>
             <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
                <p className="text-slate-400 text-sm mb-1">Active Calories</p>
                <p className="text-2xl font-bold text-orange-400">2,450</p>
             </div>
        </div>
    </div>
  );
};

export default Analysis;