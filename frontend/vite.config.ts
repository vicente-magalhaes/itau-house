import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, searchForWorkspaceRoot } from 'vite'

const designSystem = path.resolve(import.meta.dirname, '../design-system')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Os componentes de ../design-system importam 'react', mas aquela pasta não tem
    // node_modules. Sem o dedupe o build falha com "failed to resolve import react".
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    // O design system fica fora de frontend/. Sem isto o dev server recusa servir os arquivos dele.
    fs: { allow: [searchForWorkspaceRoot(process.cwd()), designSystem] },
    // /api vai para o back-end, no mesmo endereço do front: sem CORS. No Docker o destino é o
    // serviço `backend` (API_PROXY_TARGET, definido no docker-compose.yml). Na máquina, localhost.
    // No build de produção quem faz esse papel é o nginx (frontend/nginx.conf.template).
    proxy: {
      '/api': { target: process.env.API_PROXY_TARGET ?? 'http://localhost:8000', changeOrigin: true },
    },
    // Volume montado a partir do Windows não repassa ao container o aviso de arquivo alterado,
    // e o Vite continua servindo o código antigo. A varredura por tempo resolve, mas gasta CPU,
    // então só liga no Docker (WATCH_POLLING no docker-compose.yml).
    watch: process.env.WATCH_POLLING ? { usePolling: true, interval: 300 } : undefined,
  },
})
