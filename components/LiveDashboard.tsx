import React, { useEffect, useState, useRef } from 'react';
import { BiometricData, ConnectionStatus } from '../types';
import { Play, Square, Activity, Zap, Timer, Footprints, Bluetooth } from 'lucide-react';
import { analyzePostWorkout } from '../services/geminiService';

interface LiveDashboardProps {
  connectionStatus: ConnectionStatus;
}

const LiveDashboard: React.FC<LiveDashboardProps> = ({ connectionStatus }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState<BiometricData>({
    heartRate: 0,
    pace: "0:00",
    cadence: 0,
    distance: 0,
    duration: 0,
    calories: 0,
    zone: 1
  });
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Determine HR Zone Color
  const getZoneColor = (zone: number) => {
    switch (zone) {
      case 1: return "text-gray-400";
      case 2: return "text-blue-400";
      case 3: return "text-green-400";
      case 4: return "text-orange-400";
      case 5: return "text-red-500";
      default: return "text-gray-400";
    }
  };

  // Format Seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const stopWorkout = async () => {
    setIsRunning(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
    
    setIsAnalyzing(true);
    const feedback = await analyzePostWorkout({
      distance: data.distance,
      avgHr: Math.floor(data.heartRate * 0.9), // slightly lower avg than current peak
      avgPace: data.pace,
      duration: data.duration
    });
    setAiFeedback(feedback);
    setIsAnalyzing(false);
  };

  const startWorkout = () => {
    setIsRunning(true);
    setAiFeedback("");
    // Reset if starting new
    if(data.duration === 0) {
        setData({
            heartRate: 70,
            pace: "6:00",
            cadence: 0,
            distance: 0,
            duration: 0,
            calories: 0,
            zone: 1
        });
    }
  };

  // Simulation Effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setData(prev => {
          // Simulate fluctuation
          const newDuration = prev.duration + 1;
          
          // HR ramps up then stabilizes with noise
          const targetHr = 145;
          const hrNoise = Math.floor(Math.random() * 5) - 2;
          let newHr = prev.heartRate < targetHr ? prev.heartRate + 1 : prev.heartRate + hrNoise;
          if (newHr > 190) newHr = 190;

          // Calculate Zone
          let zone = 1;
          if (newHr > 100) zone = 2;
          if (newHr > 130) zone = 3;
          if (newHr > 150) zone = 4;
          if (newHr > 170) zone = 5;

          // Distance (simulating ~10km/h)
          const newDist = prev.distance + 0.003;

          // Pace simulation
          const paceSec = 360; // 6:00
          const paceVar = Math.floor(Math.random() * 10) - 5;
          const currentPaceSec = paceSec + paceVar;
          const pm = Math.floor(currentPaceSec / 60);
          const ps = currentPaceSec % 60;
          const newPace = `${pm}:${ps < 10 ? '0' : ''}${ps}`;

          return {
            heartRate: newHr,
            pace: newPace,
            cadence: 160 + (Math.floor(Math.random() * 4)),
            distance: newDist,
            duration: newDuration,
            calories: prev.calories + 0.15,
            zone: zone
          };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  if (connectionStatus !== ConnectionStatus.CONNECTED) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6 animate-pulse">
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-600">
            <Bluetooth className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-300">Earphones Not Detected</h2>
        <p className="text-slate-500 max-w-md">
            Please turn on your PulseBeat earphones to sync biometric data to the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
      
      {/* Top Stats Row - Treadmill Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
           <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-rose-500 to-transparent opacity-50`}></div>
           <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-rose-500" />
              <span className="text-xs uppercase tracking-widest text-slate-400">Heart Rate</span>
           </div>
           <span className={`text-5xl font-mono font-bold ${getZoneColor(data.zone)}`}>
             {data.heartRate}
           </span>
           <span className="text-sm text-slate-500 mt-1">BPM • Zone {data.zone}</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center">
           <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs uppercase tracking-widest text-slate-400">Pace</span>
           </div>
           <span className="text-5xl font-mono font-bold text-cyan-400">
             {data.pace}
           </span>
           <span className="text-sm text-slate-500 mt-1">MIN/KM</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center">
           <div className="flex items-center space-x-2 mb-2">
              <Footprints className="w-4 h-4 text-lime-400" />
              <span className="text-xs uppercase tracking-widest text-slate-400">Distance</span>
           </div>
           <span className="text-5xl font-mono font-bold text-lime-400">
             {data.distance.toFixed(2)}
           </span>
           <span className="text-sm text-slate-500 mt-1">KILOMETERS</span>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center">
           <div className="flex items-center space-x-2 mb-2">
              <Timer className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase tracking-widest text-slate-400">Duration</span>
           </div>
           <span className="text-5xl font-mono font-bold text-amber-400">
             {formatTime(data.duration)}
           </span>
           <span className="text-sm text-slate-500 mt-1">TIME ELAPSED</span>
        </div>
      </div>

      {/* Visualizer / Graph Area Simulation */}
      <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-200">Real-Time Biometrics</h3>
            <div className="flex space-x-4 text-xs text-slate-400 font-mono">
                <span>CADENCE: {data.cadence} SPM</span>
                <span>CALORIES: {Math.floor(data.calories)} KCAL</span>
            </div>
        </div>
        
        {/* Simulated Waveform */}
        <div className="flex-1 flex items-end space-x-1 overflow-hidden opacity-80">
             {Array.from({ length: 40 }).map((_, i) => {
                 const height = Math.max(10, Math.random() * 100 * (data.heartRate / 200));
                 return (
                     <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-slate-800 to-slate-600 rounded-t-sm transition-all duration-300"
                        style={{ height: `${isRunning ? height : 10}%` }}
                     ></div>
                 )
             })}
        </div>
        
        {!isRunning && !aiFeedback && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                 <p className="text-slate-300 font-mono">READY TO START</p>
             </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6">
          {!isRunning ? (
              <button 
                onClick={startWorkout}
                className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-lime-500 hover:bg-lime-400 transition-all shadow-[0_0_30px_rgba(132,204,22,0.3)] hover:shadow-[0_0_50px_rgba(132,204,22,0.6)]"
              >
                 <Play className="w-8 h-8 text-slate-900 ml-1 fill-current" />
              </button>
          ) : (
              <button 
                onClick={stopWorkout}
                className="group flex items-center justify-center w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-400 transition-all shadow-[0_0_30px_rgba(244,63,94,0.3)]"
              >
                 <Square className="w-8 h-8 text-white fill-current" />
              </button>
          )}
      </div>

      {/* AI Analysis Modal/Card */}
      {(aiFeedback || isAnalyzing) && (
        <div className="bg-slate-800 border border-purple-500/30 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-900/50 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="font-bold text-purple-100">Gemini Audio Coach Analysis</h4>
            </div>
            {isAnalyzing ? (
                <div className="flex items-center space-x-2 text-purple-300">
                    <span className="animate-pulse">Crunching data...</span>
                </div>
            ) : (
                <p className="text-slate-300 leading-relaxed">
                    {aiFeedback}
                </p>
            )}
        </div>
      )}
    </div>
  );
};

export default LiveDashboard;