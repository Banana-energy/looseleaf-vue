import { onMounted } from 'vue'
import { ensureInkDefs } from './defs'
import { useInkContext } from './context'

// 独立插画也需要 SVG 纹理定义，在挂载边界统一注册。
export function useEnsureInkDefs() {
  const context = useInkContext()
  onMounted(() => { if (!context.value.hasProvider) ensureInkDefs() })
}
