import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:    ['react', 'react-dom', 'react-router-dom'],
          animation: ['framer-motion'],
        },
      },
    },
  },
  server: {
    // Proxy /api to Vercel dev server during local development
    // Run `vercel dev` instead of `npm run dev` for full-stack local dev
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
