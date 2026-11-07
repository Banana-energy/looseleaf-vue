# Looseleaf Vue

Looseleaf Vue 是 [Looseleaf](https://github.com/kevintngo/looseleaf) 的 Vue 3 + TypeScript 版本，保留纸张、手绘笔触和组件交互风格。

## 开发

```bash
pnpm install
pnpm dev
```

## 校验

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## 文档语言

文档站支持 English 和简体中文。在顶部的显示设置中可以切换语言，选择会保存在浏览器本地。

## 部署

项目使用 Vercel 部署，构建命令为 `pnpm build`，产物目录为 `dist`。推送到 GitHub 主分支后，Vercel 会自动创建生产部署；其他分支和 Pull Request 会生成预览部署。

## License

MIT
