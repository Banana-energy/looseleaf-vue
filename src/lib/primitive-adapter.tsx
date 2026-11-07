import { cloneVNode, defineComponent, h, isVNode, normalizeClass, type Component, type FunctionalComponent, type VNode, type VNodeChild } from 'vue'
import type { ComponentProps } from './types'
import { Slot as RekaSlot, useForwardExpose } from 'reka-ui'

// 只在基础库边界翻译属性和事件名；组件内部仍保留原版状态和 DOM 标记。
type Model<T, G> = G extends 'Select' | 'RadioGroup' | 'Tabs' ? string : G extends 'Slider' ? number[] : ComponentProps<T> extends { modelValue?: infer V } ? NonNullable<V> : never
type ChangeCallback<T> = { change(value: T): void }['change']
type LegacyProps<T, G, P> = ComponentProps<T> & (P extends 'Root' ? G extends 'ToggleGroup' | 'Accordion' ? ({ type: 'single'; value?: string; defaultValue?: string; onValueChange?: ChangeCallback<string> } | { type: 'multiple'; value?: string[]; defaultValue?: string[]; onValueChange?: ChangeCallback<string[]> }) : { value?: Model<T, G>; onValueChange?: ChangeCallback<Model<T, G>>; pressed?: boolean; defaultPressed?: boolean; onPressedChange?: (value: boolean) => void } : object)
export function primitive<T extends Component, G extends string, P extends string>(component: T, group: G, part: P): FunctionalComponent<any> {
  return defineComponent({
    name: `Looseleaf${group}${part}`,
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
      const { forwardRef } = useForwardExpose()
      return () => {
        const props: Record<string, unknown> = { ...attrs }
        const translate = (source: string, target: string) => {
          if (source in props) { props[target] = props[source]; delete props[source] }
        }
        if ('className' in props) { props.class = normalizeClass([props.class, props.className]); delete props.className }
        translate('checked', 'modelValue'); translate('defaultChecked', 'defaultValue'); translate('onCheckedChange', 'onUpdate:modelValue')
        translate('onOpenChange', 'onUpdate:open')
        if (group === 'ToggleGroup' || group === 'Accordion') { if ('type' in props) { props.multiple = props.type === 'multiple'; delete props.type } }
        if (part === 'Root' || group === 'ToggleGroup' || group === 'Slider') {
          if (group === 'Checkbox' || group === 'Switch') {
            translate('checked', 'modelValue'); translate('defaultChecked', 'defaultValue'); translate('onCheckedChange', 'onUpdate:modelValue')
          } else if (group === 'Toggle') {
            translate('pressed', 'modelValue'); translate('defaultPressed', 'defaultValue'); translate('onPressedChange', 'onUpdate:modelValue')
          } else {
            translate('value', 'modelValue'); translate('onValueChange', 'onUpdate:modelValue')
          }
          translate('onOpenChange', 'onUpdate:open')
        }
        return h(component, { ...props, ref: forwardRef }, slots)
      }
    },
  }) as unknown as FunctionalComponent<any>
}

const Slottable = defineComponent({ name: 'LooseleafSlottable', setup(_props, { slots }) { return () => slots.default?.() } })
const flatten = (children: VNodeChild): VNode[] => Array.isArray(children) ? children.flatMap(flatten) : isVNode(children) ? [children] : []

// 原版按钮会把笔触插入被组合的链接内部，保持 asChild 后仍只有一个交互元素。
const Root = defineComponent({
  name: 'LooseleafSlot',
  inheritAttrs: false,
  setup(_props, { attrs, slots }) {
    return () => {
      const children = flatten(slots.default?.())
      const marker = children.find(child => child.type === Slottable)
      if (!marker) return <RekaSlot {...attrs}>{children}</RekaSlot>
      const markerSlots = marker.children as { default: () => VNodeChild }
      const target = flatten(markerSlots.default())[0]
      if (!target) return null
      const targetChildren = target.children
      const decoration = children.filter(child => child !== marker)
      const cloned = cloneVNode(target)
      cloned.children = typeof target.type === 'string' ? [...decoration, ...(Array.isArray(targetChildren) ? targetChildren : [targetChildren])] as VNode['children'] : { ...(targetChildren as object), default: () => [...decoration, ...flatten((targetChildren as { default?: () => VNodeChild })?.default?.())] }
      return <RekaSlot {...attrs}>{cloned}</RekaSlot>
    }
  },
})
export const Slot = { Root, Slottable }
