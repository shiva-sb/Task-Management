import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server:{
    port:3000,
    proxy: {
      '/api':{
        targer:'https://task-management-1-61z4.onrender.com'
      }
    }
  }
})
