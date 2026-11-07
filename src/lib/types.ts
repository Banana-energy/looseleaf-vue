import type { Component, CSSProperties as VueCSSProperties, FunctionalComponent, VNode, VNodeChild, VNodeRef, HTMLAttributes, ShallowRef, Ref as VueRef } from 'vue'
import type { JSX } from 'vue/jsx-runtime'

// 类型桥接仅描述迁移前后的接口形状，运行时全部由 Vue 渲染。
export type ReactNode = VNodeChild
export type VueNode = VNodeChild
export type ReactElement<P = Record<string, unknown>> = VNode & { readonly __propsType?: P }
export type CSSProperties = VueCSSProperties
export type ComponentType<P extends object = object> = FunctionalComponent<P>
export type ElementType = string | Component
type OriginalProps<T> = T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : T extends FunctionalComponent<infer P> ? P : T extends new () => { $props: infer P } ? P : never
interface PortAttributes {
  class?: string
  className?: string
  style?: VueCSSProperties
  children?: VNodeChild
  ref?: VNodeRef
  readOnly?: boolean
  tabIndex?: number
  disabled?: boolean
  defaultValue?: string | number | readonly string[]
  maxLength?: number
  inputMode?: string
  autoComplete?: string
  autoFocus?: boolean
  colSpan?: number
  rowSpan?: number
  modelValue?: string | number
  'onUpdate:modelValue'?: (value: string) => void
  onClickCapture?: (event: globalThis.MouseEvent) => void
  checked?: boolean | 'indeterminate'
  defaultChecked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean | 'indeterminate') => void
  onOpenChange?: (open: boolean) => void
}
type BridgedProps<P> = P extends unknown ? (Omit<P, 'class' | 'style'> & Pick<PortAttributes, 'class' | 'style'> & Omit<HTMLAttributes, keyof P | keyof PortAttributes> & Omit<PortAttributes, keyof P | 'class' | 'style'> & Record<string, any>) : never
// 泛型基础组件带有开放索引；移除索引后再做属性映射，保留 seed、ref 和事件的具体类型。
type ExplicitProps<P> = { [K in keyof P as string extends K ? never : number extends K ? never : K]: P[K] }
export type ComponentProps<T> = BridgedProps<ExplicitProps<OriginalProps<T>>>
export type ComponentPropsWithoutRef<T> = Omit<ComponentProps<T>, 'ref'>
export type RefCallback<T> = { callback(element: T | null): void }['callback']
export type Ref<T> = VNodeRef | VueRef<T | null>
export type RefObject<T> = ShallowRef<T>
export type MouseEvent<T = Element> = globalThis.MouseEvent & { currentTarget: T; target: EventTarget & T }
export type PointerEvent<T = Element> = globalThis.PointerEvent & { currentTarget: T; target: EventTarget & T }
export type KeyboardEvent<T = Element> = globalThis.KeyboardEvent & { currentTarget: T; target: EventTarget & T }
export type FocusEvent<T = Element> = globalThis.FocusEvent & { currentTarget: T; target: EventTarget & T }
export type ChangeEvent<T = Element> = Event & { currentTarget: T; target: EventTarget & T }
export type FormEvent<T = Element> = Event & { currentTarget: T; target: EventTarget & T }
export type DragEvent<T = Element> = globalThis.DragEvent & { currentTarget: T; target: EventTarget & T }
export type MouseEventHandler<T = Element> = (event: globalThis.PointerEvent & { readonly __host?: T }) => void
export type BaseSyntheticEvent = Event
