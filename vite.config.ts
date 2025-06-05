
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Configuração para SPA routing em desenvolvimento
    historyApiFallback: {
      index: '/index.html',
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Otimizações para SPA
    target: 'esnext',
    minify: 'esbuild',
  },
  preview: {
    port: 8080,
    host: "::",
    // Configuração para SPA routing em preview
    historyApiFallback: {
      index: '/index.html',
    },
  },
  // Base URL configuration
  base: '/',
}));
