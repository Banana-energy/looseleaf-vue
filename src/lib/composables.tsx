import { computed, defineAsyncComponent, defineComponent, getCurrentInstance, h, inject, onBeforeUnmount, onMounted, provide, shallowRef, Suspense as VueSuspense, watch, watchEffect, Text, type Component, type FunctionalComponent, type ComputedRef, type InjectionKey, type Ref, type Slot, type VNodeChild } from 'vue'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { useDirection as rekaDirection } from 'reka-ui'

// Vue 将文本插槽包装成 Text VNode；提取单段文本供原版字形测量和计数逻辑使用。
export function readSlot(slot: Slot | undefined) {
  const nodes = slot?.()
  return nodes?.length === 1 && nodes[0].type === Text ? nodes[0].children as string : nodes
}

// 只延迟读取节点，不缓存 VNode，让 Vue 在实际渲染时正确登记插槽和元素 ref。
export function renderValue<T>(render: () => T): Readonly<{ value: T }> {
  return { get value() { return render() } }
}

// 上下文桥接基于 Vue provide/inject，保留上游多子组件之间的状态边界。
export function createContext<T>(initial: T) {
  const key: InjectionKey<ComputedRef<T>> = Symbol('LooseleafContext')
  const Provider = defineComponent({
    name: 'LooseleafContextProvider',
    props: ['value'],
    setup(props, { slots }) {
      provide(key, computed(() => props.value as T))
      return () => slots.default?.()
    },
  })
  return { key, initial, Provider }
}
export function useContext<T>(context: ReturnType<typeof createContext<T>>) {
  return inject(context.key, computed(() => context.initial))
}

export function stateSetter<T>(state: Ref<T>) {
  return (next: T | ((previous: T) => T)) => { state.value = typeof next === 'function' ? (next as (previous: T) => T)(state.value) : next }
}
// React 的 state 初始化函数只执行一次；迁移后在 setup 中求值，避免把工厂函数当作状态。
export function initialState<T>(initial: T | (() => T)): T {
  return typeof initial === 'function' ? (initial as () => T)() : initial
}
// Vue 自动缓存组件的响应式渲染；异步页面通过原生异步组件加载。
export const memo = <T,>(component: T): T => component
export const lazy = (loader: () => Promise<{ default: Component }>) => defineAsyncComponent(async () => (await loader()).default) as FunctionalComponent
export const startTransition = (update: () => void) => update()
export const Suspense = defineComponent({ name: 'LooseleafSuspense', props: ['fallback'], setup(props, { slots }) { return () => h(VueSuspense, null, { default: slots.default, fallback: () => props.fallback as VNodeChild }) } })
export const useLooseleafDirection = (source?: MaybeRefOrGetter<'ltr' | 'rtl' | undefined>) => rekaDirection(computed(() => toValue(source)))

// 画板与彩纸组件公开命令式操作，Vue 消费者通过模板 ref 直接访问这些方法。
export function useImperativeHandle<T>(_ref: unknown, factory: () => T) {
  const instance = getCurrentInstance()
  onMounted(() => { if (instance) instance.exposed = factory() as Record<string, unknown> })
}

// 将效果的清理挂到 Vue 生命周期；显式依赖保持原版触发范围，避免副作用随渲染重复注册。
export function watchDependencies(effect: () => void | (() => void), dependencies: (() => readonly unknown[]) | undefined, layout: boolean) {
  let stop: (() => void) | undefined
  let cleanup: void | (() => void)
  const execute = () => { cleanup?.(); cleanup = effect() }
  onMounted(() => {
    if (dependencies) { execute(); stop = watch(dependencies, execute, { flush: layout ? 'sync' : 'post' }) }
    else stop = watchEffect(onCleanup => { const dispose = effect(); if (dispose) onCleanup(dispose) }, { flush: 'post' })
  })
  onBeforeUnmount(() => { stop?.(); cleanup?.() })
}

// 外部订阅通过 Vue shallowRef 通知组件，订阅资源在卸载时释放。
export function useExternalStore<T>(subscribe: (notify: () => void) => () => void, snapshot: () => T) {
  const state = shallowRef(snapshot())
  let stop: (() => void) | undefined
  onMounted(() => { stop = subscribe(() => { state.value = snapshot() }) })
  onBeforeUnmount(() => stop?.())
  return state
}
