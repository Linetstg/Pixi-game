import { defineConfig } from 'vite';
import path from 'path'; 

export default defineConfig({
  base: '/Pixi-game/',  
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
})