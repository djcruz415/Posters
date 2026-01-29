import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private getApiKey(): string {
    const key = process.env.API_KEY;
    if (!key || key === 'undefined' || key === '') {
      throw new Error("La API KEY no está configurada. Verifica las variables de entorno en Vercel y vuelve a desplegar.");
    }
    return key;
  }

  private async ensureBase64(imageSource: string): Promise<{ data: string; mimeType: string }> {
    if (imageSource.startsWith('data:')) {
      const [header, data] = imageSource.split(',');
      const mimeType = header.split(':')[1].split(';')[0];
      return { data, mimeType };
    }

    try {
      const response = await fetch(imageSource);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve({ data: base64, mimeType: blob.type || 'image/png' });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting URL to base64:", error);
      throw new Error("No se pudo procesar la imagen actual para editarla.");
    }
  }

  async generatePosterBackground(prompt: string, style: string = "modern corporate tech"): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Generate a professional high-quality advertising poster background for a business. 
              The topic is: "${prompt}". 
              The style should be: ${style}. 
              The background should be clean, leaving space for text overlays. 
              Include abstract tech elements, friendly 3D AI characters or smooth customer service interfaces. 
              NO TEXT in the image itself. High resolution, 4k aesthetic.`
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Image Generation Error:", error);
      throw error;
    }
  }

  async editImage(imageSource: string, prompt: string): Promise<string | null> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    try {
      const { data, mimeType } = await this.ensureBase64(imageSource);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: data,
                mimeType: mimeType
              }
            },
            {
              text: `You are a professional graphic designer. 
              Modify this image strictly following this instruction: "${prompt}". 
              Preserve the general layout but apply the requested changes in style, color, lighting or elements. 
              Ensure the result looks high-end and suitable for a business advertisement.`
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Image Edit Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();