import { defineUi } from '@/lib/component'
import { svgPatternDefs, type PaperTileName } from '@/lib/ink/textures'

export const PAPER_DEF_TILES: readonly PaperTileName[] = ['fibre', 'relief', 'slip', 'kraft', 'cloud']
// 纸纹定义保持原版 SVG 标识，确保复杂纸边与纸面引用同一组纹理。
export const PaperDefs = defineUi<{ tiles?: readonly PaperTileName[] }>('PaperDefs', ['tiles'], props => () => <svg data-ll-paper-defs="" width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true" focusable="false"><defs innerHTML={svgPatternDefs({ tiles: props.tiles ?? PAPER_DEF_TILES })} /></svg>)
export function ensurePaperDefs(tiles: readonly PaperTileName[]): void {
  if (typeof document === 'undefined') return
  const missing = tiles.filter(tile => !document.getElementById(`ll-tex-${tile}-img`))
  if (!missing.length) return
  const holder = document.createElement('div')
  holder.innerHTML = `<svg data-ll-paper-defs="" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${svgPatternDefs({ tiles: missing })}</defs></svg>`
  const svg = holder.firstElementChild
  if (svg) document.body.appendChild(svg)
}
