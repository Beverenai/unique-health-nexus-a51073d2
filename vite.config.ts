
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
      registerType: 'autoUpdate',
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
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
