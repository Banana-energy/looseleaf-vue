import { computed, shallowRef, toValue, watchEffect, type ComponentPublicInstance, type MaybeRefOrGetter, type VNodeChild, type VNodeRef } from 'vue'
import type { Tier } from '@/lib/ink/types'
import { bucketBox, stableStringify, type Box, type InkLayerName, type Recipe } from '@/lib/ink/recipes'
import { inkFrame } from './cache'
import { useInkContext, useInkSeed } from './context'
import { ensureInkDefs } from './defs'
import { InkSvg } from './svg'

export type ElementRef = (element: Element | ComponentPublicInstance | null) => void
export interface UseInkOptions<P> {
  recipe: Recipe<P>
  params: P
  kind?: string
  pad?: number
  size?: readonly [number, number]
  tier?: Tier
  layers?: 'lazy' | 'all' | readonly InkLayerName[]
  seed?: string | number
  still?: boolean
}
export interface InkHostProps { 'data-ink-host': ''; 'data-ink-ready'?: '' }

// Reka UI 暴露的是组件实例；绘制必须测量实际宿主元素，而非组件代理。
export function toElement(value: Element | ComponentPublicInstance | null): HTMLElement | null {
  let element = value && '$el' in value ? value.$el as Node : value
  // Reka 的 Fragment 根节点以前导注释定位，实际宿主紧随其后。
  if (element && !(element instanceof Element)) element = element.nextSibling
  return element instanceof HTMLElement ? element : null
}
export function useInkBox(source: MaybeRefOrGetter<{ size?: readonly [number, number] }>) {
  const element = shallowRef<HTMLElement | null>(null)
  const box = shallowRef<Box | null>(null)
  watchEffect((cleanup) => {
    const explicit = toValue(source).size
    if (explicit) { box.value = bucketBox(explicit[0], explicit[1]); return }
    const el = element.value
    if (!el) return
    const update = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      if (!(w > 0 && h > 0)) return
      const next = bucketBox(w, h)
      if (!box.value || box.value.w !== next.w || box.value.h !== next.h) box.value = next
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    cleanup(() => observer.disconnect())
  }, { flush: 'post' })
  const hostRef: ElementRef = value => { element.value = toElement(value) }
  return { hostRef, element, box }
}

export function useInkCore<P>(source: MaybeRefOrGetter<UseInkOptions<P>>) {
  const options = computed(() => toValue(source))
  const context = useInkContext()
  const seed = useInkSeed(() => options.value.seed)
  const { hostRef, element, box } = useInkBox(() => ({ size: options.value.size }))
  const wanted = shallowRef<readonly InkLayerName[]>([])
  const seenDir = shallowRef<'ltr' | 'rtl'>()
  watchEffect(cleanup => {
    const el = element.value
    const recipe = options.value.recipe
    if (!el) return
    if (!context.value.hasProvider) ensureInkDefs()
    const direction = el.closest('[dir]')?.getAttribute('dir') ?? el.ownerDocument.documentElement.getAttribute('dir')
    seenDir.value = direction === 'ltr' || direction === 'rtl' ? direction : undefined
    const cleanups: Array<() => void> = []
    const triggers: Partial<Record<InkLayerName, string[]>> = { focus: ['focusin'], hover: ['pointerenter'], pressed: ['pointerdown', 'keydown'] }
    for (const layer of recipe.lazy) {
      for (const type of triggers[layer] ?? []) {
        const listener = (event: Event) => {
          if (layer === 'focus' && event.target instanceof Element && !event.target.matches(':focus-visible')) return
          if (event.type === 'keydown' && !['Enter', ' '].includes((event as KeyboardEvent).key)) return
          if (!wanted.value.includes(layer)) wanted.value = [...wanted.value, layer]
        }
        el.addEventListener(type, listener, { passive: true })
        cleanups.push(() => el.removeEventListener(type, listener))
      }
    }
    cleanup(() => cleanups.forEach(stop => stop()))
  }, { flush: 'post' })
  const frame = computed(() => {
    if (!box.value) return null
    const o = options.value
    const ctx = context.value
    const eager = o.layers === 'all' || (o.layers === undefined && (o.tier ?? ctx.tier) === 'hi') ? o.recipe.lazy : Array.isArray(o.layers) ? o.layers : []
    return inkFrame(o.recipe, { box: box.value, params: o.params, seed: seed.value, tier: o.tier ?? ctx.tier, density: ctx.density, dir: seenDir.value ?? ctx.dir, knobs: ctx.knobs, pad: o.pad, paramsKey: stableStringify(o.params), lazy: [...new Set([...eager, ...wanted.value])] })
  })
  const hostProps = computed<InkHostProps>(() => frame.value ? { 'data-ink-host': '', 'data-ink-ready': '' } : { 'data-ink-host': '' })
  const still = computed(() => options.value.still ?? (context.value.density === 'calm' || context.value.motion === 'reduced'))
  return { hostRef, hostProps, frame, box, seed, still }
}

export function useInk<P>(source: MaybeRefOrGetter<UseInkOptions<P>>) {
  const core = useInkCore(source)
  const node = computed<VNodeChild>(() => core.frame.value ? <InkSvg kind={toValue(source).kind ?? toValue(source).recipe.kind} frame={core.frame.value} still={core.still.value} /> : null)
  return { ...core, node }
}
export type UseInkResult = ReturnType<typeof useInk>

// 与 Vue 模板 ref 生命周期配合，同时转发绘制引用和使用者引用。
export function useMergedRef<T extends Element>(...refs: Array<VNodeRef | ((value: T | null) => unknown) | { value: T | null } | undefined>) {
  const stops = new Map<unknown, () => void>()
  return (value: Element | ComponentPublicInstance | null) => {
    for (const source of refs) {
      const element = toElement(value) as T | null
      if (typeof source === 'function') {
        stops.get(source)?.()
        stops.delete(source)
        const stop = (source as (element: T | null, refs: Record<string, unknown>) => unknown)(element, {})
        if (typeof stop === 'function') stops.set(source, stop as () => void)
      }
      else if (source && typeof source !== 'string') source.value = element
    }
  }
}
export const mergeRefs = (...refs: Array<ElementRef | undefined>): ElementRef => value => refs.forEach(ref => ref?.(value))
