import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// 保留原版 Tailwind 编译链，使主题变量和状态选择器具有一致的样式语义。
export default defineConfig({
  base: './',
  plugins: [vue(), vueJsx(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  // 文档站把大量 Vue JSX 示例作为应用源码直接加载；Vite 8 的依赖扫描器默认只扫描 TS，不应把这些 .tsx 当成普通脚本解析。
  optimizeDeps: { noDiscovery: true },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
  },
})
