import { defineConfig } from 'vite'

export default defineConfig({
  preview: {
    allowedHosts: ['aquatic-j7rc.onrender.com'], // allow Render domain
    host: '0.0.0.0',                            // listen on all IPs
    port: process.env.PORT || 4173,             // use Render's port
  },
})