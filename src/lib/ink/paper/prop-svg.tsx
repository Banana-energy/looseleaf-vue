import { onMounted, type SVGAttributes } from 'vue'
import { defineUi, omitProps } from '@/lib/component'
import type { InkResult } from '@/lib/ink/builder'
import { ensureInkDefs } from '@/lib/ink/vue/defs'
import { useInkContext } from '@/lib/ink/vue/context'

// 艺术资源继续使用原版生成的 SVG 内容，Vue 负责属性与生命周期。
export const PropSvg = defineUi<{ res: InkResult; kind: string } & SVGAttributes>('PropSvg', ['res', 'kind'], props => {
  const context = useInkContext()
  onMounted(() => { if (!context.value.hasProvider) ensureInkDefs() })
  return () => <svg data-ink={props.kind} aria-hidden="true" focusable="false" width={props.res.w} height={props.res.h} viewBox={`0 0 ${props.res.w} ${props.res.h}`} {...omitProps(props, ['res', 'kind'])} style={[{ overflow: 'visible' }, props.style]} innerHTML={props.res.svg} />
})
