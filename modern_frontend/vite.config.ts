import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Disable minification to prevent code mangling issues
    minify: false,
    // Disable code splitting to prevent module loading issues
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Disable source maps for production debugging
    sourcemap: false,
    // Target modern browsers to avoid polyfill issues
    target: 'esnext',
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://infrastructure-management-system-production.up.railway.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
