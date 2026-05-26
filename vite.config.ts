import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // 适配 Windows 访问 WSL/UNC 路径时的文件监听异常。
    watch: {
      usePolling: true,
    },
  },
})
