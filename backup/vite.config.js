import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'carwashcodecampaign-production.up.railway.app',
      '.railway.app'
    ]
  },
  server: {
    host: true,
    port: process.env.PORT || 3000
  }
}) 