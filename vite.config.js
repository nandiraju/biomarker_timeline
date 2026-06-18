import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Configured base path for GitHub Pages deployment
export default defineConfig({
  plugins: [react()],
  base: '/biomarker_timeline/',   // Required for GitHub Pages sub-path
})
