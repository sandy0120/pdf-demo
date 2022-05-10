import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    open: true
  },
  base: '/pdf-demo/',
  build: {
    target: 'modules' // 默认值
  },
  css: {
    preprocessorOptions: {
      scss: {
        uietDeps: true,
        additionalData: `@import "/src/styles/base/all.scss";`
      }
    }
  }
})
