import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  cacheDir: '../../node_modules/.vite',

  server: {
    proxy: {
      '^(?!/site).*$': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
