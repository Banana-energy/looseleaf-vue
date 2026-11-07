import { defineComponent, mergeProps, normalizeClass, type FunctionalComponent, type HTMLAttributes, type SetupContext, type VNodeChild, type VNodeRef, type ComponentPublicInstance } from 'vue'

export interface UiProps extends HTMLAttributes {
  seed?: string | number
}
type VueProps<P> = P extends unknown ? 'className' extends keyof P ? Omit<P, 'className'> & { class?: string } : P : never
type PublicProps<P> = P extends unknown ? Omit<VueProps<P>, 'children'> & { children?: VNodeChild } : never

// 多个子组件保留在同一 TSX 模块；这里统一处理 Vue 属性透传，避免额外 DOM 改变原版布局。
export function defineUi<P extends object>(name: string, keys: readonly string[], setup: (props: VueProps<P> & Record<string, any>, context: SetupContext) => () => VNodeChild): FunctionalComponent<any> {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: [...keys],
    setup(props, context) {
      const values = new Proxy(props, {
        get(target, key) {
          if (key === 'class' && 'className' in context.attrs) return normalizeClass([Reflect.get(target, 'class'), context.attrs.class, context.attrs.className])
          return key in target ? Reflect.get(target, key) : Reflect.get(context.attrs, key)
        },
        ownKeys(target) { return [...new Set([...Reflect.ownKeys(context.attrs), ...Reflect.ownKeys(target)])].filter(key => key !== 'className') },
        getOwnPropertyDescriptor() { return { enumerable: true, configurable: true } },
      })
      return setup(values as VueProps<P>, context) as () => VNodeChild
    },
  }) as unknown as FunctionalComponent<any>
}

// Vue 会给组件 ref 传实例；DOM 回调在边界解包 $el，避免把代理当成元素测量或聚焦。
export function elementRef<T extends Element>(callback: (element: T | null) => unknown): VNodeRef {
  return (node: Element | ComponentPublicInstance | null) => callback((node && '$el' in node ? node.$el : node) as T | null)
}

// 仅移除当前组件消费的属性，其余原生属性和事件继续交给实际交互元素。
type Without<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never
export function omitProps<T extends object, const K extends readonly string[]>(source: T, keys: K): Without<T, K[number]> {
  return Object.fromEntries(Object.entries(source).filter(([key]) => !keys.includes(key))) as Without<T, K[number]>
}

export { mergeProps }

// Vue JSX 的标签类型不接受字符串联合；运行时仍直接交给 Vue 渲染动态宿主。
export const jsxTag = (tag: string | object | FunctionalComponent) => tag as FunctionalComponent<HTMLAttributes>

// JSX 展开属性也必须遵守 Vue 的命名，避免 className 覆盖已经合并好的纸张定位样式。
export function domProps<T extends object | undefined>(source: T, input = false): Omit<T, 'className'> & { class?: string } {
  const result: Record<string, unknown> = { ...source }
  if (input) {
    // 保留原示例的逐字输入行为，并向 Vue 消费者提供标准 v-model。
    const change = result.onChange as ((event: Event) => void) | undefined
    const onInput = result.onInput as ((event: Event) => void) | undefined
    const update = result['onUpdate:modelValue'] as ((value: string) => void) | undefined
    if ('modelValue' in result) result.value = result.modelValue
    if (change || onInput || update) result.onInput = (event: Event) => { onInput?.(event); change?.(event); update?.((event.target as HTMLInputElement | HTMLTextAreaElement).value) }
    delete result.onChange; delete result.modelValue; delete result['onUpdate:modelValue']
  }
  if ('className' in result) { result.class = normalizeClass([result.class, result.className]); delete result.className }
  const names: Record<string, string> = { readOnly: 'readonly', tabIndex: 'tabindex', autoComplete: 'autocomplete', autoFocus: 'autofocus', maxLength: 'maxlength', minLength: 'minlength', noValidate: 'novalidate', colSpan: 'colspan', rowSpan: 'rowspan', contentEditable: 'contenteditable', spellCheck: 'spellcheck' }
  for (const [before, after] of Object.entries(names)) if (before in result) { result[after] = result[before]; delete result[before] }
  return result as Omit<T, 'className'> & { class?: string }
}
