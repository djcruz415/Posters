
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl">CX</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">CX Automations</h1>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">Poster Creator</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Plantillas</a>
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Historial</a>
          <div className="h-4 w-px bg-white/10"></div>
          <button className="text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-all">
            Dashboard
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
