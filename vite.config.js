import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
      include: ['**/*.js', '**/*.jsx'], // Add this line to process JSX in .js files
    })],
})
