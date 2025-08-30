import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',  // this is critical for Render hosting
  preview: {
    allowedHosts: ["aquatic-j7rc.onrender.com"], // replace with your Render frontend domain
  },
});