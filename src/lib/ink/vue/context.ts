import { computed, inject, useId, type ComputedRef, type InjectionKey, type MaybeRefOrGetter, toValue } from 'vue'
import type { Knobs } from '@/lib/ink/builder'
import type { Tier } from '@/lib/ink/types'
import { DEFAULT_KNOBS, type Density, type Dir } from '@/lib/ink/recipes'
import { createContext } from '@/lib/composables'

export interface InkScopeProps {
  'data-density'?: Density
  'data-motion'?: 'reduced'
  'data-theme'?: string
}
export interface InkContextValue {
  tier: Tier
  density: Density
  dir: Dir
  motion: 'system' | 'reduced'
  knobs: Knobs
  hasProvider: boolean
  scope: InkScopeProps
}

// 默认参数来自固定上游版本，确保没有 Provider 的独立组件仍遵循原始绘制契约。
export const DEFAULT_INK_CONTEXT: InkContextValue = {
  tier: 'lo', density: 'comfortable', dir: 'ltr', motion: 'system', knobs: DEFAULT_KNOBS, hasProvider: false, scope: {},
}
export const InkContext = createContext(DEFAULT_INK_CONTEXT)
export function useInkContext() { return inject(InkContext.key, computed(() => DEFAULT_INK_CONTEXT)) }
export function useDensity() { const context = useInkContext(); return computed(() => context.value.density) }
export function useInkTier() { const context = useInkContext(); return computed(() => context.value.tier) }
export function useInkKnobs() { const context = useInkContext(); return computed(() => context.value.knobs) }
export function useInkScope() { const context = useInkContext(); return computed(() => context.value.scope) }
export function useInkSeed(seed?: MaybeRefOrGetter<string | number | undefined>) {
  const id = useId()
  return computed(() => toValue(seed) === undefined ? id : String(toValue(seed)))
}
