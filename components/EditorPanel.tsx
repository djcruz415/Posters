
import React, { useState, useRef } from 'react';
import { PosterData, AppStatus } from '../types';

interface EditorPanelProps {
  data: PosterData;
  onUpdate: (newData: Partial<PosterData>) => void;
  onAIEdit: (prompt: string) => void;
  onGenerateBg: (style: string) => void;
  status: AppStatus;
  error: string | null;
}

const STYLES = [
  { id: 'modern', label: 'Moderno Tech', prompt: 'clean modern corporate tech with 3D elements, blue and white theme' },
  { id: 'minimal', label: 'Minimalista', prompt: 'minimalist elegant office setting, soft lighting, professional' },
  { id: 'cyber', label: 'Futurista', prompt: 'futuristic cyberpunk neon blue and purple, digital agents, hologram' },
  { id: 'human', label: 'Cercano', prompt: 'friendly smiling customer support representative in a modern bright office' }
];

const EditorPanel: React.FC<EditorPanelProps> = ({ data, onUpdate, onAIEdit, onGenerateBg, status, error }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].prompt);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPrompt.trim() && status !== AppStatus.EDITING_IMAGE) {
      onAIEdit(aiPrompt);
      setAiPrompt('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onUpdate({ featuredImageUrl: ev.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isEditing = status === AppStatus.EDITING_IMAGE;

  return (
    <div className="glass-panel p-6 rounded-3xl flex flex-col gap-8 h-full max-h-[85vh] overflow-y-auto custom-scrollbar">
      {/* Visual Background Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
          <i className="fas fa-image"></i>
          Fondo del Afiche
        </h3>

        {/* Manual Upload and AI Controls */}
        <div className="flex flex-col gap-4">
          <div 
            onClick={() => !isEditing && fileInputRef.current?.click()}
            className={`group relative h-40 w-full rounded-2xl overflow-hidden border-2 border-dashed transition-all flex flex-col items-center justify-center bg-white/5 ${
              isEditing ? 'opacity-50 cursor-wait border-white/5' : 'border-white/10 hover:border-blue-500/50 cursor-pointer'
            }`}
          >
            <img 
              src={data.featuredImageUrl} 
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" 
              alt="Current Background" 
            />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors ${!isEditing && 'group-hover:bg-blue-600'}`}>
                <i className={`fas ${isEditing ? 'fa-spinner fa-spin' : 'fa-upload'} text-white`}></i>
              </div>
              <span className="text-xs font-bold text-white">
                {isEditing ? 'Procesando...' : 'Subir tu propia imagen'}
              </span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
              disabled={isEditing}
            />
          </div>

          <div className="h-px bg-white/5 my-2"></div>

          {/* AI Generation Controls */}
          <div className="space-y-3">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Generar con IA</span>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.prompt)}
                  disabled={isEditing}
                  className={`text-[10px] py-2 px-3 rounded-xl border transition-all font-bold uppercase ${
                    selectedStyle === style.prompt 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  } disabled:opacity-50`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => onGenerateBg(selectedStyle)}
              disabled={isEditing}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-3 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] border border-white/10 disabled:opacity-50"
            >
              {isEditing ? (
                <i className="fas fa-circle-notch fa-spin text-blue-400"></i>
              ) : (
                <i className="fas fa-magic text-blue-400"></i>
              )}
              {isEditing ? 'IA Trabajando...' : 'IA: Generar Nuevo Fondo'}
            </button>
          </div>
        </div>

        <div className="h-px bg-white/5 my-4"></div>

        <form onSubmit={handleSubmitAI} className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-gray-500 font-bold uppercase">Ajuste Fino con IA</label>
            {isEditing && <span className="text-[10px] text-blue-400 font-bold animate-pulse">Editando imagen...</span>}
          </div>
          <div className={`relative transition-all ${isEditing ? 'ring-2 ring-blue-500/50' : ''}`}>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ej: 'Haz que el fondo sea más oscuro' o 'Añade un brillo azul'..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-20 disabled:opacity-50"
              disabled={isEditing}
            />
            <button
              type="submit"
              disabled={isEditing || !aiPrompt.trim()}
              className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 shadow-lg"
            >
              <i className={`fas ${isEditing ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'} text-xs`}></i>
            </button>
          </div>
          <p className="text-[9px] text-gray-600 leading-tight">
            * Describe cambios visuales específicos que quieras aplicar a la imagen actual.
          </p>
        </form>
      </section>

      {/* Text Content */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <i className="fas fa-font"></i>
          Textos del Afiche
        </h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Título</label>
            <input 
              type="text" 
              value={data.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo</label>
            <textarea 
              value={data.subtitle}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none h-24 resize-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Llamada a la Acción</label>
            <input 
              type="text" 
              value={data.ctaText}
              onChange={(e) => onUpdate({ ctaText: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 animate-bounce">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}
    </div>
  );
};

export default EditorPanel;
