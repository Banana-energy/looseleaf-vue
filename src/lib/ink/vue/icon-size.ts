import { computed, inject, provide, defineComponent, type ComputedRef, type InjectionKey } from 'vue'

// 图标尺寸通过 Vue 注入传递，保持按钮各尺寸下的原版图标比例。
export const IconSizeContext: InjectionKey<ComputedRef<number | undefined>> = Symbol('LooseleafIconSize')
export function useIconSize() { return inject(IconSizeContext, computed(() => undefined)) }
export const IconSizeProvider = defineComponent({
  name: 'IconSizeProvider',
  props: { value: Number },
  setup(props, { slots }) {
    provide(IconSizeContext, computed(() => props.value))
    return () => slots.default?.()
  },
})
