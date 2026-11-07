import { computed, shallowRef, useId, type VNodeChild } from 'vue'
import { defineUi, omitProps } from './component'
import { createContext } from './composables'
import type * as UI from './types'

export const REGEXP_ONLY_DIGITS = '^\\d+$'
export const REGEXP_ONLY_CHARS = '^[a-zA-Z]+$'
export const REGEXP_ONLY_DIGITS_AND_CHARS = '^[a-zA-Z0-9]+$'
interface SlotState { char?: string; placeholderChar?: string; isActive: boolean; hasFakeCaret: boolean }
export const OTPInputContext = createContext<{ slots: SlotState[] }>({ slots: [] })
interface OTPProps extends Omit<UI.ComponentProps<'input'>, 'onChange' | 'value' | 'defaultValue'> {
  maxLength: number; value?: string; defaultValue?: string; onChange?: (value: string) => void; onComplete?: (value: string) => void; pasteTransformer?: (value: string) => string; containerClassName?: string; render?: (context: { slots: SlotState[] }) => VNodeChild
}
// 保留单个原生输入框，支持系统验证码自动填充、粘贴与读屏；可见格子继续由原版配方绘制。
export const OTPInput = defineUi<OTPProps>('OTPInputPrimitive', ['maxLength', 'value', 'defaultValue', 'onChange', 'onComplete', 'pasteTransformer', 'containerClassName', 'render', 'placeholder'], (props, { slots }) => {
  const inner = shallowRef(props.defaultValue === undefined ? '' : props.defaultValue)
  const focused = shallowRef(false)
  const position = shallowRef(0)
  const value = computed(() => props.value === undefined ? inner.value : props.value)
  const id = useId()
  const context = computed(() => ({ slots: Array.from({ length: props.maxLength }, (_, index) => ({ char: value.value[index], placeholderChar: props.placeholder?.[index], isActive: focused.value && index === Math.min(position.value, props.maxLength - 1), hasFakeCaret: focused.value && index === value.value.length && !value.value[index] })) }))
  const update = (input: HTMLInputElement, next: string) => {
    const limited = next.slice(0, props.maxLength)
    if (limited && props.pattern && !new RegExp(props.pattern).test(limited)) { input.value = value.value; return }
    inner.value = limited
    props.onChange?.(limited)
    position.value = input.selectionStart ?? limited.length
    if (limited.length === props.maxLength) props.onComplete?.(limited)
  }
  return () => <OTPInputContext.Provider value={context.value}><div data-input-otp-container="" class={props.containerClassName} style={{ position: 'relative' }}><input {...omitProps(props, ['maxLength', 'value', 'defaultValue', 'onChange', 'onComplete', 'pasteTransformer', 'containerClassName', 'render', 'placeholder'])} id={props.id === undefined ? id : props.id} value={value.value} maxlength={props.maxLength} autocomplete="one-time-code" inputmode={props.pattern === REGEXP_ONLY_DIGITS ? 'numeric' : 'text'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, zIndex: 1 }} onInput={event => update(event.target as HTMLInputElement, (event.target as HTMLInputElement).value)} onFocus={() => { focused.value = true; position.value = value.value.length }} onBlur={() => { focused.value = false }} onClick={event => { position.value = (event.target as HTMLInputElement).selectionStart ?? value.value.length }} onPaste={event => { if (!props.pasteTransformer) return; event.preventDefault(); const input = event.target as HTMLInputElement; const text = props.pasteTransformer(event.clipboardData!.getData('text')); update(input, value.value.slice(0, input.selectionStart!) + text + value.value.slice(input.selectionEnd!)) }} />{props.render ? props.render(context.value) : slots.default?.()}</div></OTPInputContext.Provider>
})
