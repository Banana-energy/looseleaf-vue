import { onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { defineUi } from '@/lib/component'
import { GRAINS } from '@/lib/ink/builder'
import { PAPER_TILES, inkDefsSvg, svgMaskDefs, svgPatternDefs, textureCssVars, type GrainMaskKind, type PaperTileName } from '@/lib/ink/textures'

const owners = new Map<object, () => void>()
const firstOwner = () => owners.keys().next().value

// 同页多个 Provider 共用纹理定义，防止 SVG ID 重复导致笔触遮罩引用错位。
export const InkDefs = defineUi<{ kinds?: readonly GrainMaskKind[]; patterns?: boolean | readonly PaperTileName[] }>('InkDefs', ['kinds', 'patterns'], (props) => {
  const owner = {}
  const hidden = shallowRef(false)
  onMounted(() => {
    const update = () => { hidden.value = firstOwner() !== owner || document.querySelector('[data-ll-defs="injected"]') !== null }
    owners.set(owner, update)
    update()
  })
  onBeforeUnmount(() => {
    owners.delete(owner)
    for (const update of owners.values()) queueMicrotask(update)
  })
  return () => {
    if (hidden.value) return null
    const patterns = props.patterns
    const html = svgMaskDefs({ kinds: props.kinds === undefined ? GRAINS : props.kinds }) + (patterns ? svgPatternDefs(patterns === true ? {} : { tiles: patterns }) : '')
    return <svg data-ll-defs="" width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true" focusable="false"><defs innerHTML={html} /></svg>
  }
})

export const InkTiles = defineUi<{ tiles: readonly PaperTileName[] | true }>('InkTiles', ['tiles'], (props) => () => {
  const names = props.tiles === true ? Object.keys(PAPER_TILES) as PaperTileName[] : props.tiles
  return <>{names.map(name => <style key={name} data-ll-texture={name}>{textureCssVars([name])}</style>)}</>
})

export function ensureInkDefs(): void {
  if (typeof document === 'undefined' || owners.size > 0 || document.querySelector('[data-ll-defs]') || document.getElementById('ll-felt-0')) return
  const holder = document.createElement('div')
  holder.innerHTML = inkDefsSvg({ kinds: GRAINS })
  const svg = holder.firstElementChild
  if (svg) { svg.setAttribute('data-ll-defs', 'injected'); document.body.appendChild(svg) }
}

// 字体随本地主题打包，组件无需在运行时向上游网站加载字体。
export function ensureInkFonts(): void { /* 本地 fonts.css 已声明 Kevin Sans。 */ }
export function useEnsureInkDefs(): void { onMounted(ensureInkDefs) }
