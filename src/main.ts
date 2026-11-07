import { createApp } from 'vue'
import { DocsApp } from './docs/App'
import { discoverCatalog } from './docs/core/discover'
import { LibraryProviders } from './docs/providers'
import './styles/docs.css'

// 开发入口使用本地主题和字体，确保对比环境不依赖远程资源。
const app = createApp(DocsApp, { catalog: discoverCatalog(), Providers: LibraryProviders })
// 开发期记录组件边界错误，避免文档侧栏被错误边界静默吞掉而无法定位迁移差异。
app.config.errorHandler = (error, _instance, info) => {
  const details = { error: String(error), info }
  window.__looseleafErrors = [...(window.__looseleafErrors ?? []), details]
  console.error('[Looseleaf]', details)
}
app.mount('#app')
