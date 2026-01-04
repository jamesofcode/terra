import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/terra/',
  plugins: [vue()],
  server: {
    port: 3000
  }
})
