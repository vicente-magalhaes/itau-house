import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O front importa o design system que vive fora de web/ (design-system/).
// fs.allow libera a leitura desses arquivos pelo dev server.
export default defineConfig({
  plugins: [react()],
  server: { fs: { allow: ['..'] }, port: 5173 },
  build: { outDir: 'dist' },
});
