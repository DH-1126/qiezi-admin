import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/qiezi-admin/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/mock-api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
})
