import { computed, onBeforeUnmount, onMounted, provide, shallowRef, watch } from 'vue'
import { defineUi } from '@/lib/component'
import type { Knobs } from '@/lib/ink/builder'
import type { Tier } from '@/lib/ink/types'
import type { PaperTileName } from '@/lib/ink/textures'
import { DEFAULT_KNOBS, resolveKnobs, type Density, type Dir } from '@/lib/ink/recipes'
import { InkContext, useInkContext, type InkScopeProps } from './context'
import { InkDefs, InkTiles } from './defs'

export interface InkProviderProps {
  tier?: Tier
  density?: Density
  motion?: 'system' | 'reduced'
  theme?: string
  dir?: Dir
  knobs?: Partial<Knobs>
  textures?: boolean | readonly PaperTileName[]
  defs?: boolean
  patterns?: boolean | readonly PaperTileName[]
}

export const InkProvider = defineUi<InkProviderProps>('InkProvider', ['tier', 'density', 'motion', 'theme', 'dir', 'knobs', 'textures', 'defs', 'patterns'], (props, { slots }) => {
  const outer = useInkContext()
  const element = shallowRef<HTMLElement>()
  const cssKnobs = shallowRef<Knobs>(DEFAULT_KNOBS)
  const inheritedDensity = shallowRef<Density>('comfortable')
  const inheritedDir = shallowRef<Dir>('ltr')
  const read = () => {
    const el = element.value
    if (!el) return
    const css = getComputedStyle(el)
    // 读取上游定义的 CSS token，保持 CSS 调参和绘制算法同步。
    const token = (name: string, initial: number) => { const value = Number.parseFloat(css.getPropertyValue(name)); return Number.isFinite(value) ? value : initial }
    cssKnobs.value = { wobble: token('--ll-wobble', 1), misreg: token('--ll-misreg-k', 1), bleed: token('--ll-bleed', 6) / 6, width: token('--ll-stroke-fine', 1.7) / 1.7 }
    const density = el.parentElement?.closest('[data-density]')?.getAttribute('data-density')
    inheritedDensity.value = density === 'compact' || density === 'calm' ? density : 'comfortable'
    const dir = el.parentElement?.closest('[dir]')?.getAttribute('dir') ?? el.ownerDocument.documentElement.getAttribute('dir')
    inheritedDir.value = dir === 'rtl' ? 'rtl' : 'ltr'
  }
  let observer: MutationObserver | undefined
  onMounted(() => {
    read()
    observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-density', 'data-motion', 'dir'] })
    if (element.value) observer.observe(element.value, { attributes: true, attributeFilter: ['data-theme', 'data-density', 'data-motion', 'dir'] })
  })
  onBeforeUnmount(() => observer?.disconnect())
  watch(() => [props.theme, props.density, props.motion], read, { flush: 'post' })
  const value = computed(() => {
    const density = props.density ?? inheritedDensity.value
    const scope: InkScopeProps = { ...outer.value.scope }
    if (props.density) scope['data-density'] = props.density
    if (props.motion === 'reduced') scope['data-motion'] = 'reduced'
    if (props.theme) scope['data-theme'] = props.theme
    return { tier: props.tier ?? 'lo', density, dir: props.dir ?? inheritedDir.value, motion: props.motion ?? 'system', knobs: resolveKnobs({ ...cssKnobs.value, ...props.knobs }, density), hasProvider: true, scope }
  })
  provide(InkContext.key, value)
  return () => <div ref={element} data-ll-scope="" data-density={props.density} data-motion={props.motion === 'reduced' ? 'reduced' : undefined} data-theme={props.theme} style={{ display: 'contents' }}>
    {props.defs !== false && <InkDefs patterns={props.patterns} />}
    {props.textures && <InkTiles tiles={props.textures} />}
    {slots.default?.()}
  </div>
})
