import { computed, onBeforeUnmount, onMounted, reactive, shallowRef, toValue, useId, watchEffect, type MaybeRefOrGetter } from 'vue'
import { ComboboxRoot, ComboboxInput, ComboboxContent, ComboboxItem, ComboboxGroup, ComboboxLabel, Primitive } from 'reka-ui'
import { defineUi, omitProps } from './component'
import { createContext, useContext } from './composables'
import type * as UI from './types'

export type Filter = (value: string, search: string, keywords?: string[]) => number
// 搜索按原始文本和关键词匹配；导航、选中与读屏属性由 Reka 管理。
export const defaultFilter: Filter = (value, search, keywords = []) => [value, ...keywords].join(' ').toLocaleLowerCase().includes(search.toLocaleLowerCase()) ? 1 : 0
interface CommandState { search: string; value: string; selectedItemId?: string; filtered: { count: number } }
interface CommandContext { state: CommandState; register: (id: string, text: () => string, keywords: () => string[] | undefined) => () => void; matches: (value: string, keywords?: string[]) => boolean; setSearch: (value: string) => void }
const Context = createContext<CommandContext | undefined>(undefined)
type RootProps = UI.ComponentProps<'div'> & { value?: string; onValueChange?: (value: string) => void; shouldFilter?: boolean; filter?: Filter; loop?: boolean; label?: string }
const Root = defineUi<RootProps>('CommandPrimitive', ['value', 'onValueChange', 'shouldFilter', 'filter', 'loop', 'label'], (props, { slots }) => {
  const state = reactive<CommandState>({ search: '', value: '', filtered: { count: 0 } })
  const entries = reactive(new Map<string, { text: () => string; keywords: () => string[] | undefined }>())
  const matches = (value: string, keywords?: string[]) => props.shouldFilter === false || !state.search || (props.filter ?? defaultFilter)(value, state.search, keywords) > 0
  watchEffect(() => { state.filtered.count = [...entries.values()].filter(entry => matches(entry.text(), entry.keywords())).length })
  const context = { state, matches, setSearch: (value: string) => { state.search = value }, register: (id: string, text: () => string, keywords: () => string[] | undefined) => { entries.set(id, { text, keywords }); return () => { entries.delete(id) } } }
  return () => <Context.Provider value={context}><ComboboxRoot {...omitProps(props, ['value', 'onValueChange', 'shouldFilter', 'filter', 'loop', 'label'])} open ignoreFilter resetSearchTermOnBlur={false} resetSearchTermOnSelect={false} loop={props.loop} aria-label={props.label} onHighlight={item => { if (item) { state.value = String(item.value); state.selectedItemId = item.ref.id; props.onValueChange?.(state.value) } }} cmdk-root="">{slots.default?.()}</ComboboxRoot></Context.Provider>
})
type InputProps = UI.ComponentProps<'input'> & { onValueChange?: (value: string) => void }
const Input = defineUi<InputProps>('CommandPrimitiveInput', ['value', 'onValueChange'], (props) => {
  const context = useContext(Context)
  return () => <ComboboxInput {...omitProps(props, ['value', 'onValueChange'])} modelValue={props.value === undefined ? context.value?.state.search : String(props.value)} onUpdate:modelValue={value => { context.value?.setSearch(value); props.onValueChange?.(value) }} cmdk-input="" />
})
const List = defineUi<UI.ComponentProps<'div'> & { label?: string }>('CommandPrimitiveList', ['label'], (props, { slots }) => () => <ComboboxContent {...omitProps(props, ['label'])} forceMount aria-label={props.label} cmdk-list="">{slots.default?.()}</ComboboxContent>)
type ItemProps = UI.ComponentProps<'div'> & { value: string; keywords?: string[]; onSelect?: (value: string) => void; forceMount?: boolean }
const Item = defineUi<ItemProps>('CommandPrimitiveItem', ['value', 'keywords', 'onSelect', 'forceMount', 'disabled'], (props, { slots }) => {
  const context = useContext(Context)
  const id = useId()
  let stop: (() => void) | undefined
  onMounted(() => { stop = context.value?.register(id, () => props.value, () => props.keywords) })
  onBeforeUnmount(() => stop?.())
  return () => props.forceMount || context.value?.matches(props.value, props.keywords) ? <ComboboxItem {...omitProps(props, ['value', 'keywords', 'onSelect', 'forceMount', 'disabled'])} value={props.value} disabled={props.disabled} textValue={[props.value, ...(props.keywords ?? [])].join(' ')} data-selected={context.value?.state.value === props.value} data-disabled={props.disabled || undefined} onSelect={() => props.onSelect?.(props.value)} cmdk-item="">{slots.default?.()}</ComboboxItem> : null
})
const Group = defineUi<UI.ComponentProps<'div'> & { heading?: UI.ReactNode }>('CommandPrimitiveGroup', ['heading'], (props, { slots }) => () => <ComboboxGroup {...omitProps(props, ['heading'])} cmdk-group="">{props.heading && <ComboboxLabel cmdk-group-heading="">{props.heading}</ComboboxLabel>}{slots.default?.()}</ComboboxGroup>)
const Empty = defineUi<UI.ComponentProps<'div'>>('CommandPrimitiveEmpty', [], (props, { slots }) => { const context = useContext(Context); return () => context.value?.state.filtered.count === 0 ? <div {...props} cmdk-empty="">{slots.default?.()}</div> : null })
const Loading = defineUi<UI.ComponentProps<'div'>>('CommandPrimitiveLoading', [], (props, { slots }) => () => <div role="progressbar" {...props} cmdk-loading="">{slots.default?.()}</div>)
const Separator = defineUi<UI.ComponentProps<'div'> & { asChild?: boolean; alwaysRender?: boolean }>('CommandPrimitiveSeparator', ['asChild', 'alwaysRender'], (props, { slots }) => () => <Primitive as="div" role="separator" {...omitProps(props, ['alwaysRender'])} cmdk-separator="">{slots.default?.()}</Primitive>)
export const Command = Object.assign(Root, { Input, List, Item, Group, Empty, Loading, Separator })
export function useCommandState<T>(selector: MaybeRefOrGetter<(state: CommandState) => T>) {
  const context = useContext(Context)
  return computed(() => context.value && toValue(selector)(context.value.state))
}
