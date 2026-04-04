import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        destinations: path.resolve(__dirname, 'destinations.html'),
        packages: path.resolve(__dirname, 'packages.html'),
        services: path.resolve(__dirname, 'services.html'),
        about: path.resolve(__dirname, 'about.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        dashboard: path.resolve(__dirname, 'dashboard.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});

