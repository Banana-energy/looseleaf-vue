import type { CSSProperties } from 'vue'

const unitless = new Set(['animationIterationCount', 'aspectRatio', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth', 'columnCount', 'columns', 'fillOpacity', 'flex', 'flexGrow', 'flexShrink', 'fontWeight', 'gridArea', 'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart', 'lineHeight', 'opacity', 'order', 'orphans', 'scale', 'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth', 'tabSize', 'widows', 'zIndex', 'zoom'])

// React 会自动为长度数值补 px；Vue 迁移在样式边界显式完成相同转换。
export function cssStyle(style: CSSProperties | undefined): CSSProperties | undefined {
  if (!style) return style
  return Object.fromEntries(Object.entries(style).map(([key, value]) => [key, typeof value === 'number' && value !== 0 && !key.startsWith('--') && !unitless.has(key) ? `${value}px` : value])) as CSSProperties
}
