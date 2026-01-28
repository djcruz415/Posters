
# 🚀 CX Automations - Poster Creator

Generador de afiches publicitarios con Inteligencia Artificial.

## 🛠️ Cómo desplegar este proyecto

### 1. Subir a GitHub
1. Crea un nuevo repositorio en [GitHub](https://github.com/new).
2. Inicializa git en tu carpeta local:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin TU_URL_DE_REPOSITORIO
   git push -u origin main
   ```

### 2. Desplegar en Vercel
1. Ve a [Vercel](https://vercel.com) e inicia sesión con GitHub.
2. Haz clic en **"Add New"** > **"Project"**.
3. Importa tu repositorio recién creado.
4. **IMPORTANTE (Variables de Entorno):**
   - En la sección **"Environment Variables"**, añade una nueva variable:
     - **Key:** `API_KEY`
     - **Value:** (Pega aquí tu clave de Google AI Studio)
5. Haz clic en **"Deploy"**.

### 3. Actualizar cambios
Cada vez que hagas un `git push` a tu repositorio, Vercel actualizará la página automáticamente.

---
Desarrollado para **CX Automations**.
