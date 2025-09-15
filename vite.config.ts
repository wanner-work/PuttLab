import path from "path"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['jeep-sqlite/loader']
  },
  plugins: [
    tailwindcss(), 
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
