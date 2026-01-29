import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Esto es crucial: reemplaza literalmente 'process.env.API_KEY' en tu código 
    // con el valor real que tenga Vercel durante el build.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', '@google/genai', 'html2canvas']
        }
      }
    }
  }
});