import fs from 'node:fs'

// 纸面分层保留原版结构，仅替换 JSX 属性及框架入口。
const root = process.argv[2]
let source = fs.readFileSync(`${root}/src/lib/ink/paper/sheet-layers.tsx`, 'utf8')
source = source.replace('"use client"', '')
  .replace('import * as React from "react"', 'import { computed, toValue, type CSSProperties, type MaybeRefOrGetter } from "vue"\nimport { defineUi } from "@/lib/component"')
  .replaceAll('@/lib/ink/react', '@/lib/ink/vue')
  .replace('export function SheetLayers({ kind, frame, still }: { kind: string; frame: Frame; still?: boolean }) {', 'export const SheetLayers = defineUi<{ kind: string; frame: Frame; still?: boolean }>("SheetLayers", ["kind", "frame", "still"], props => () => {\n const { kind, frame, still } = props')
  .replace('React.useMemo(() => piecesOf(frame), [frame])', 'piecesOf(frame)')
  .replaceAll('React.CSSProperties', 'CSSProperties')
  .replaceAll('className=', 'class=')
  .replaceAll('suppressHydrationWarning ', '')
  .replace('dangerouslySetInnerHTML={{ __html: markup }}', 'innerHTML={markup}')
  .replace('\n}\n\nexport function useInkFaces', '\n})\n\nexport function useInkFaces')
source = source.slice(0, source.indexOf('export function useInkFaces')).replace(/\}\s*$/, '})\n') + `
// 纸面由 Vue computed 驱动，尺寸或绘制参数变化时重新组合纸面和笔触图层。
export function useInkFaces<P>(source: MaybeRefOrGetter<UseInkOptions<P>>) {
  const core = useInkCore(source)
  const node = computed(() => {
    const frame = core.frame.value
    if (!frame) return null
    const options = toValue(source)
    const kind = options.kind ?? options.recipe.kind
    const faced = frame.layers.some(layer => hasFace(frame.parts[layer] ?? ''))
    return faced ? <SheetLayers key="ink" kind={kind} frame={frame} still={core.still.value} /> : <InkSvg key="ink" kind={kind} frame={frame} still={core.still.value} />
  })
  return { ...core, node }
}
`
source = source.replace('width: ww, height: hh', 'width: `${ww}px`, height: `${hh}px`')
fs.writeFileSync('src/lib/ink/paper/sheet-layers.tsx', '// 沿用上游纸面拆分算法，保留纸张阴影和绘制图层的先后顺序。\n' + source)
