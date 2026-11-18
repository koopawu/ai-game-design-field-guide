import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative assets keep the site compatible with GitHub Pages project URLs.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
