
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add debugging log to help identify tooltip issues
console.log('Starting application - Using CustomTooltip implementation only, no Radix tooltips');

// Function to unregister all service workers and register new one
const registerNewServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Unregister all existing service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('Unregistering old service worker:', registration.scope);
        await registration.unregister();
      }

      // Clear caches to remove any old code
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(
          cacheKeys.map(key => {
            console.log('Deleting cache:', key);
            return caches.delete(key);
          })
        );
      }

      // Register the new service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('New Service Worker registered with scope:', registration.scope);
      
      // Force update if needed
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    } catch (err) {
      console.error('Service Worker registration or cleanup failed:', err);
    }
  }
};

// Run the service worker registration
registerNewServiceWorker();

// Create root and render app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
