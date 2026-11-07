import { computed, shallowRef, watch, type ComponentPublicInstance, type VNodeRef, type MaybeRefOrGetter, toValue } from 'vue'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle, type SplitterPanelProps } from 'reka-ui'
import { defineUi, omitProps } from './component'
import type * as UI from './types'

export type Layout = Record<string, number>
export interface LayoutStorage { getItem(name: string): string | null; setItem(name: string, value: string): void }
export interface GroupImperativeHandle { getLayout(): Layout; setLayout(layout: Layout): void }
export interface PanelImperativeHandle { collapse(): void; expand(): void; resize(size: number): void; isCollapsed(): boolean; isExpanded(): boolean; getSize(): number }
export type GroupProps = UI.ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical'; disabled?: boolean; resizeTargetMinimumSize?: { coarse: number; fine: number }; onLayoutChange?: (layout: Layout) => void; onLayoutChanged?: (layout: Layout) => void; defaultLayout?: Layout; groupRef?: VNodeRef }
export type PanelProps = UI.ComponentProps<'div'> & Omit<SplitterPanelProps, 'defaultSize' | 'minSize' | 'maxSize' | 'collapsedSize'> & { defaultSize?: number | string; minSize?: number | string; maxSize?: number | string; collapsedSize?: number | string; panelRef?: VNodeRef; onResize?: (size: { asPercentage: number; asPixels?: number }) => void }
export type SeparatorProps = UI.ComponentProps<'div'> & { disabled?: boolean; elementRef?: VNodeRef }
const percent = (size: number | string | undefined) => typeof size === 'string' ? Number.parseFloat(size) : size
// Reka Splitter 负责拖动、键盘调整与尺寸约束；手绘分隔线留在组件层。
export const Group = defineUi<GroupProps>('ResizableGroupPrimitive', ['orientation', 'disabled', 'resizeTargetMinimumSize', 'groupRef', 'onLayoutChange', 'onLayoutChanged', 'defaultLayout'], (props, { slots }) => () => <SplitterGroup {...omitProps(props, ['orientation', 'disabled', 'resizeTargetMinimumSize', 'groupRef', 'onLayoutChange', 'onLayoutChanged', 'defaultLayout'])} direction={props.orientation === undefined ? 'horizontal' : props.orientation} ref={props.groupRef} onLayout={sizes => { const layout = Object.fromEntries(sizes.map((size, index) => [String(index), size])); props.onLayoutChange?.(layout); props.onLayoutChanged?.(layout) }}>{slots.default?.()}</SplitterGroup>)
export const Panel = defineUi<PanelProps>('ResizablePanelPrimitive', ['defaultSize', 'minSize', 'maxSize', 'collapsedSize', 'panelRef', 'onResize'], (props, { slots }) => () => <SplitterPanel {...omitProps(props, ['defaultSize', 'minSize', 'maxSize', 'collapsedSize', 'panelRef', 'onResize'])} defaultSize={percent(props.defaultSize)} minSize={percent(props.minSize)} maxSize={percent(props.maxSize)} collapsedSize={percent(props.collapsedSize)} ref={props.panelRef} onResize={size => props.onResize?.({ asPercentage: size })}>{slots.default?.()}</SplitterPanel>)
export const Separator = defineUi<SeparatorProps>('ResizableSeparatorPrimitive', ['elementRef'], (props, { slots }) => () => <SplitterResizeHandle {...omitProps(props, ['elementRef'])} ref={props.elementRef}>{slots.default?.()}</SplitterResizeHandle>)
// Vue 使用模板 ref 访问面板公开方法，无需复制 React 的 ref hook。
export const usePanelRef = () => shallowRef<ComponentPublicInstance<PanelImperativeHandle> | null>(null)
export const useGroupRef = () => shallowRef<ComponentPublicInstance<GroupImperativeHandle> | null>(null)

// 将布局保存恢复与组件树解耦，便于示例使用内存存储或 localStorage。
export function useDefaultLayout(source: MaybeRefOrGetter<{ id: string; storage: LayoutStorage; panelIds: string[] }>) {
  const options = toValue(source)
  const raw = options.storage.getItem(options.id)
  const defaultLayout = raw === null ? undefined : JSON.parse(raw) as Layout
  const onLayoutChanged = (layout: Layout) => options.storage.setItem(options.id, JSON.stringify(layout))
  return computed(() => ({ defaultLayout, onLayoutChanged }))
}
