import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['react-error-boundary'],
      output: {
        globals: {
          'react-error-boundary': 'ReactErrorBoundary'
        }
      }
    }
  }
})
