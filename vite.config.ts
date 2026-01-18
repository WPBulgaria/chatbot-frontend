import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(), tailwindcss(),
  ],

   // base: process.env.NODE_ENV !== "development" ? '/apps/audit/' : "/",
   server: {
    port: 3999,
    host: true,
    allowedHosts: ['wpstudio.local', 'localhost', '127.0.0.1', 'wpbulgaria.com'],
  },
})