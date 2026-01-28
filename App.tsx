
import React, { useState, useRef } from 'react';
import { PosterData, AppStatus } from './types';
import { geminiService } from './services/geminiService';
import Poster from './components/Poster';
import EditorPanel from './components/EditorPanel';
import Header from './components/Header';
import html2canvas from 'html2canvas';

const DEFAULT_POSTER: PosterData = {
  title: "Agentes Personalizados con IA disponibles las 24 horas",
  subtitle: "Atiende a tus clientes sin interrupciones con los detalles más importantes de tu negocio automatizados.",
  ctaText: "¡Automatiza tu éxito hoy!",
  logoUrl: "https://i.ibb.co/hR8jSgW1/logo.png",
  featuredImageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1000",
  secondaryImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
};

const App: React.FC = () => {
  const [posterData, setPosterData] = useState<PosterData>(DEFAULT_POSTER);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const handleUpdatePoster = (newData: Partial<PosterData>) => {
    setPosterData(prev => ({ ...prev, ...newData }));
  };

  const handleGenerateBackground = async (style: string) => {
    setStatus(AppStatus.EDITING_IMAGE);
    setErrorMessage(null);
    try {
      const prompt = `${posterData.title}. ${posterData.subtitle}`;
      const newImage = await geminiService.generatePosterBackground(prompt, style);
      if (newImage) {
        handleUpdatePoster({ featuredImageUrl: newImage });
      }
    } catch (err: any) {
      setErrorMessage("Error al generar el fondo: " + err.message);
    } finally {
      setStatus(AppStatus.IDLE);
    }
  };

  const handleAIEdit = async (prompt: string) => {
    setStatus(AppStatus.EDITING_IMAGE);
    setErrorMessage(null);
    try {
      const editedImage = await geminiService.editImage(posterData.featuredImageUrl, prompt);
      if (editedImage) {
        handleUpdatePoster({ featuredImageUrl: editedImage });
      }
    } catch (err: any) {
      setErrorMessage("Error al editar: " + err.message);
    } finally {
      setStatus(AppStatus.IDLE);
    }
  };

  const downloadPosterAsImage = async () => {
    const element = document.getElementById('poster-container');
    if (!element) return;

    setIsCapturing(true);
    try {
      // Use html2canvas to capture the element. scale: 2 for better quality.
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
        logging: false
      });
      
      const image = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = image;
      link.download = `poster-cx-automations-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error capturing image:", err);
      setErrorMessage("No se pudo generar la imagen para descargar.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <Header />
      
      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; background: white !important; }
          #poster-container, #poster-container * { visibility: visible; }
          #poster-container {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            border: none;
            border-radius: 0;
            box-shadow: none;
          }
          aside, header, footer, .no-print { display: none !important; }
        }
      `}</style>

      <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-8 gap-8 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-[500px] aspect-[3/4] sticky top-24">
            <div ref={posterRef} className="w-full h-full">
              <Poster data={posterData} />
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center no-print">
              <button 
                onClick={downloadPosterAsImage}
                disabled={isCapturing}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isCapturing ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-image"></i>
                )}
                Descargar Imagen (JPG)
              </button>
              
              <button 
                onClick={handlePrint}
                className="flex-1 bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
              >
                <i className="fas fa-file-pdf"></i>
                PDF / Imprimir
              </button>
            </div>
            
            <p className="mt-4 text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold no-print">
              Diseño profesional listo para compartir
            </p>
          </div>
        </div>
        
        <aside className="w-full lg:w-96 no-print">
          <EditorPanel 
            data={posterData} 
            onUpdate={handleUpdatePoster} 
            onAIEdit={handleAIEdit}
            onGenerateBg={handleGenerateBackground}
            status={status}
            error={errorMessage}
          />
        </aside>
      </main>
      
      <footer className="py-6 text-center text-gray-600 text-sm border-t border-white/5 no-print">
        &copy; 2024 CX Automations | Motor de Diseño Publicitario IA
      </footer>
    </div>
  );
};

export default App;
