import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({ sassVariables: 'src/assets/quasar-variables.sass' }),
    vueJsx()
  ],
  resolve: {
    alias: {
      '@api': fileURLToPath(new URL('../api/src', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  cacheDir: '../../node_modules/.vite',
  server: {
    proxy: {
      '^(?!/site).*$': {
        // target for testing with production backend
        target: 'http://localhost',
        // target for single service testing
        // target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
