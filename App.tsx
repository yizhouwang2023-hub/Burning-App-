import React, { useState, useEffect } from 'react';
import { ViewState, ConnectionStatus } from './types';
import LiveDashboard from './components/LiveDashboard';
import WorkoutPlanner from './components/WorkoutPlanner';
import Analysis from './components/Analysis';
import { 
  Activity, 
  Calendar, 
  BarChart2, 
  Settings, 
  Headphones, 
  Bluetooth, 
  User,
  Battery
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [batteryLevel, setBatteryLevel] = useState(82);

  // Simulate connection process
  const handleConnect = () => {
    if (connectionStatus === ConnectionStatus.CONNECTED) {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      return;
    }
    
    setConnectionStatus(ConnectionStatus.SEARCHING);
    setTimeout(() => {
      setConnectionStatus(ConnectionStatus.CONNECTED);
    }, 2500);
  };

  // Render content based on state
  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <LiveDashboard connectionStatus={connectionStatus} />;
      case ViewState.PLANNER:
        return <WorkoutPlanner />;
      case ViewState.ANALYSIS:
        return <Analysis />;
      default:
        return <div className="flex items-center justify-center h-full text-slate-500">Settings Coming Soon</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-20 md:w-64 border-r border-slate-800 bg-[#0f172a] flex flex-col justify-between z-10 transition-all">
        <div>
          <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center shadow-lg shadow-lime-500/20">
                <Activity className="text-slate-900 w-6 h-6" />
             </div>
             <span className="hidden md:block ml-3 font-bold text-xl tracking-tight text-white">PulseBeat</span>
          </div>

          <nav className="mt-8 space-y-2 px-2">
            <button 
              onClick={() => setCurrentView(ViewState.DASHBOARD)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${currentView === ViewState.DASHBOARD ? 'bg-slate-800 text-lime-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
            >
              <Activity className="w-5 h-5 md:mr-3" />
              <span className="hidden md:block font-medium">Live Run</span>
            </button>
            
            <button 
              onClick={() => setCurrentView(ViewState.PLANNER)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${currentView === ViewState.PLANNER ? 'bg-slate-800 text-purple-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
            >
              <Calendar className="w-5 h-5 md:mr-3" />
              <span className="hidden md:block font-medium">AI Planner</span>
            </button>

            <button 
              onClick={() => setCurrentView(ViewState.ANALYSIS)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${currentView === ViewState.ANALYSIS ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
            >
              <BarChart2 className="w-5 h-5 md:mr-3" />
              <span className="hidden md:block font-medium">Analysis</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center p-2 rounded-lg bg-slate-900 border border-slate-800">
              <img src="https://picsum.photos/100/100" alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
              <div className="hidden md:block ml-3 overflow-hidden">
                <p className="text-sm font-bold text-slate-200 truncate">Alex Runner</p>
                <p className="text-xs text-slate-500">Pro Member</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <header className="h-20 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-between px-6 md:px-10 sticky top-0 z-20">
           <h1 className="text-xl font-bold text-white tracking-wide">
             {currentView === ViewState.DASHBOARD && 'Dashboard'}
             {currentView === ViewState.PLANNER && 'Workout Planner'}
             {currentView === ViewState.ANALYSIS && 'Performance Analysis'}
           </h1>

           {/* Device Connection Status Pill */}
           <div className="flex items-center space-x-4">
              {connectionStatus === ConnectionStatus.CONNECTED && (
                 <div className="hidden md:flex items-center space-x-2 text-xs text-lime-400 bg-lime-900/20 px-3 py-1 rounded-full border border-lime-500/20">
                    <Battery className="w-3 h-3" />
                    <span>{batteryLevel}%</span>
                 </div>
              )}
              
              <button 
                onClick={handleConnect}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  connectionStatus === ConnectionStatus.CONNECTED 
                    ? 'bg-lime-500/10 text-lime-400 border-lime-500/50 shadow-[0_0_15px_rgba(132,204,22,0.2)]' 
                    : connectionStatus === ConnectionStatus.SEARCHING
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                 {connectionStatus === ConnectionStatus.CONNECTED ? (
                   <>
                     <Headphones className="w-4 h-4 mr-2" />
                     <span>Connected</span>
                   </>
                 ) : connectionStatus === ConnectionStatus.SEARCHING ? (
                    <>
                      <Bluetooth className="w-4 h-4 mr-2 animate-spin" />
                      <span>Searching...</span>
                    </>
                 ) : (
                   <>
                     <Bluetooth className="w-4 h-4 mr-2" />
                     <span>Connect Earphones</span>
                   </>
                 )}
              </button>
           </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
           {/* Subtle background overlay for depth */}
           <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0f172a]/95 to-[#0f172a] pointer-events-none"></div>
           
           <div className="relative z-10 h-full">
             {renderContent()}
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;