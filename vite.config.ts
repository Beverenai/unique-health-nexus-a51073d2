
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({ 
      registerType: 'prompt', // Change to prompt to avoid automatic registration
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png', 'lovable-uploads/*.png'],
      manifest: {
        name: 'Unique Health Nexus',
        short_name: 'Unique',
        description: 'Din personlige helseassistent',
        theme_color: '#9b87f5',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/lovable-uploads/385afec9-6f8a-4281-9fd7-527f33ad1c96.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/lovable-uploads/385afec9-6f8a-4281-9fd7-527f33ad1c96.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Force Workbox to replace existing precaches
        cleanupOutdatedCaches: true,
        // Don't include runtime caching to avoid conflicts
        runtimeCaching: [],
        // Add a unique build ID to ensure cache refresh
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,json}'],
        maximumFileSizeToCacheInBytes: 5000000
      },
      devOptions: {
        enabled: true, // Enable for easier testing
        type: 'module'
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
