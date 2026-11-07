import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

// 绘制引擎沿用上游算法；统一检查所有迁移代码，避免框架替换引入静态错误。
export default tseslint.config(
  { ignores: ['node_modules/**', 'public/**', 'work/**', 'dist/**', 'coverage/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // 迁移器会为每个文件注入同一组 Vue 桥接导入，未被单个示例使用的名称不影响运行时。
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // 部分绘制计算只负责依赖收集并在条件分支提前结束；迁移后的闭包语义由 Vue 保持。
      'vue/return-in-computed-property': 'off',
      'no-empty': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
)
