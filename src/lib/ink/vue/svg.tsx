import { defineUi } from '@/lib/component'
import { inkViewBox } from '@/lib/ink/builder'
import type { Frame } from './cache'

// 保持原版的图层顺序和 SVG 坐标，只有框架插入 HTML 的方式改用 Vue innerHTML。
export const InkSvg = defineUi<{ kind: string; frame: Frame | null; still?: boolean }>('InkSvg', ['kind', 'frame', 'still'], (props) => () => {
  const frame = props.frame
  const pad = frame?.pad ?? 0
  return <svg data-ink={props.kind} data-still={props.still ? '' : undefined} aria-hidden="true" focusable="false" class="pointer-events-none absolute" viewBox={frame ? inkViewBox(frame) : undefined} preserveAspectRatio="none" style={{ position: 'absolute', pointerEvents: 'none', left: -pad, top: -pad, width: `calc(100% + ${2 * pad}px)`, height: `calc(100% + ${2 * pad}px)`, overflow: 'visible', zIndex: -1 }}>
    {frame?.layers.map(name => <g key={name} data-layer={name} innerHTML={frame.parts[name]} />)}
  </svg>
})
