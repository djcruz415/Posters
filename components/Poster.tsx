
import React from 'react';
import { PosterData } from '../types';

interface PosterProps {
  data: PosterData;
}

const Poster: React.FC<PosterProps> = ({ data }) => {
  return (
    <div id="poster-container" className="relative w-full h-full bg-white text-slate-900 overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={data.featuredImageUrl} 
          alt="Poster Background" 
          className="w-full h-full object-cover brightness-90 contrast-110 transition-all duration-700"
        />
        {/* Gradient Overlay for Text Readability - Slightly lighter at the top now */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col p-10 lg:p-12 justify-end">
        {/* Center Content - Moved more towards the center/bottom since the top is empty */}
        <div className="mb-4">
          <div className="w-16 h-1.5 bg-blue-500 mb-8 rounded-full shadow-lg shadow-blue-500/50"></div>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-6 drop-shadow-2xl tracking-tight">
            {data.title}
          </h2>
          <p className="text-xl text-gray-200 font-medium leading-relaxed mb-10 drop-shadow-md max-w-[90%]">
            {data.subtitle}
          </p>
          
          <div className="flex items-center gap-6">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i+10}`} 
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-xl"
                    alt="user avatar"
                  />
                ))}
             </div>
             <div className="flex flex-col">
               <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">Confianza total</p>
               <p className="text-[10px] text-gray-400 font-medium">Más de 500 empresas automatizadas</p>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-10 border-t border-white/20 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-[0.2em] mb-2">Comienza el cambio</p>
            <p className="text-white font-bold text-xl tracking-tight">{data.ctaText}</p>
          </div>
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-white hover:bg-blue-50 text-black rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer group">
              <i className="fab fa-whatsapp text-2xl group-hover:text-green-600 transition-colors"></i>
            </div>
            <div className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer">
              <i className="fas fa-arrow-right text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Gloss Effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-40"></div>
      
      {/* Decorative corner element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent blur-2xl"></div>
    </div>
  );
};

export default Poster;
