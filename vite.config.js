import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import commonjs from '@rollup/plugin-commonjs'
import path from 'path'

export default defineConfig({
  uni: {
    vue3: {
      vitePath: 'vite'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'uview-plus': path.resolve(__dirname, 'node_modules/uview-plus')
    }
  },
  plugins: [uni(), commonjs()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'import']
      }
    }
  },
  build: {
    minify: 'terser'
  }
})
