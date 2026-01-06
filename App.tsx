import React, { useState } from 'react';
import { UserApp } from './components/UserApp';
import { AdminCRM } from './components/AdminCRM';
import { Droplets, LayoutDashboard, Smartphone } from 'lucide-react';

// Simple view router for the demo
enum ViewState {
  LANDING = 'LANDING',
  USER_APP = 'USER_APP',
  ADMIN_CRM = 'ADMIN_CRM'
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);

  if (view === ViewState.LANDING) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-cyan-200 flex flex-col items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-white/50">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500 p-4 rounded-full shadow-lg shadow-blue-500/30">
              <Droplets className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Shuddhneer</h1>
          <p className="text-slate-500 mb-8">Pure hydration, delivered.</p>

          <div className="space-y-4">
            <button
              onClick={() => setView(ViewState.USER_APP)}
              className="w-full group flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all duration-200"
            >
              <Smartphone className="w-5 h-5" />
              Launch Customer App
            </button>
            <button
              onClick={() => setView(ViewState.ADMIN_CRM)}
              className="w-full group flex items-center justify-center gap-3 bg-white text-slate-700 py-4 px-6 rounded-xl font-semibold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <LayoutDashboard className="w-5 h-5 text-slate-500 group-hover:text-blue-500" />
              Open Admin CRM
            </button>
          </div>
        </div>
        <p className="mt-8 text-xs text-slate-400">Select a portal to view the demo</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Global Navigation to switch views during development/demo */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setView(ViewState.LANDING)}
          className="bg-slate-800 text-white text-xs px-3 py-1 rounded-full opacity-50 hover:opacity-100 transition-opacity"
        >
          Exit Demo
        </button>
      </div>

      {view === ViewState.USER_APP ? <UserApp /> : <AdminCRM />}
    </div>
  );
};

export default App;