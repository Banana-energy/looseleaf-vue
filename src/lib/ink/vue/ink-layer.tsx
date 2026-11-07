import { onBeforeUnmount, watch, type MaybeRefOrGetter } from 'vue'
import { defineUi } from '@/lib/component'
import { useInkCore, toElement, type UseInkOptions } from './hooks'
import { InkSvg } from './svg'

export type InkProps<P> = UseInkOptions<P>
// 独立 Ink 层测量其父元素，保持上游可嵌入任意原生 DOM 的使用方式。
export const Ink = defineUi<UseInkOptions<unknown>>('Ink', ['recipe', 'params', 'kind', 'pad', 'size', 'tier', 'layers', 'seed', 'still'], props => {
  const core = useInkCore(props as MaybeRefOrGetter<UseInkOptions<unknown>>)
  let host: HTMLElement | null = null
  const anchor = (element: Parameters<typeof toElement>[0]) => {
    host = toElement(element)?.parentElement ?? null
    if (host) { host.setAttribute('data-ink-host', ''); core.hostRef(host) }
  }
  watch(core.frame, frame => { if (host) { if (frame) host.setAttribute('data-ink-ready', ''); else host.removeAttribute('data-ink-ready') } })
  onBeforeUnmount(() => { host?.removeAttribute('data-ink-host'); host?.removeAttribute('data-ink-ready') })
  return () => <InkSvg ref={anchor} kind={props.kind ?? props.recipe.kind} frame={core.frame.value} still={core.still.value} />
})
