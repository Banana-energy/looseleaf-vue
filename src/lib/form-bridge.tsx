import { computed, toValue, watch, type MaybeRefOrGetter, type VNode, type VNodeChild } from 'vue'
import { useField, useForm as useVeeForm, type FormOptions, type FormContext, type Path, type PathValue, type TypedSchema } from 'vee-validate'
import { defineUi } from './component'
import { createContext } from './composables'
import { toElement } from './ink/vue'
import type { Resolver } from './schema-bridge'

export type FieldValues = Record<string, unknown>
export type FieldPath<T extends FieldValues> = Path<T>
export interface FieldError { message?: string; type?: string }
export type FieldErrors<T> = { [K in keyof T]?: T[K] extends object ? FieldErrors<T[K]> & FieldError : FieldError }
export interface UseFormReturn<T extends FieldValues> {
  control: FormContext<T>
  formState: { errors: FieldErrors<T>; isDirty: boolean; isValid: boolean; isSubmitting: boolean; submitCount: number; isSubmitSuccessful: boolean }
  handleSubmit: (submit: (values: T) => void | Promise<void>, invalid?: (errors: FieldErrors<T>) => void) => (event?: Event) => Promise<unknown>
  reset: (values?: T) => void
  setError: (name: Path<T> | 'root' | `root.${string}`, error: FieldError) => void
  setFocus: (name: Path<T>) => void
  register: <N extends Path<T>>(name: N) => { name: N; value: PathValue<T, N>; onChange: (event: Event) => void; onBlur: () => void; ref: (element: Parameters<typeof toElement>[0]) => void }
  getValues: { (): T; <N extends Path<T>>(name: N): PathValue<T, N> }
  trigger: (name?: Path<T>) => Promise<boolean>
  watch: { (): T; <K extends keyof T>(name: K): T[K]; (callback: (values: T) => void): { unsubscribe: () => void } }
}
// 原示例的表单接口在此对接 vee-validate，所有校验和字段状态使用同一份 Vue 表单上下文。
export function useForm<T extends FieldValues>(source: MaybeRefOrGetter<{ resolver?: TypedSchema<T, T> | Resolver<T>; defaultValues: T; mode?: string; reValidateMode?: string }>) {
  const options = toValue(source)
  const schema = computed<TypedSchema<T, T> | undefined>(() => {
    const resolver = toValue(source).resolver
    if (resolver === undefined) return undefined
    if ('__type' in resolver) return resolver
    return { __type: 'VVTypedSchema', async parse(values) { const result = await resolver(values, undefined, undefined); return { value: Object.keys(result.errors).length === 0 ? result.values as T : undefined, errors: Object.entries(result.errors).map(([path, error]) => ({ path, errors: [error.message] })) } } }
  })
  const form = useVeeForm<T, T>({ initialValues: options.defaultValues as FormOptions<T>['initialValues'], validationSchema: schema })
  const elements = new Map<string, HTMLElement>()
  const read = (name: string) => name.replaceAll('[', '.').replaceAll(']', '').split('.').reduce<unknown>((value, key) => (value as Record<string, unknown>)[key], form.values)
  const errors = computed(() => {
    const tree: Record<string, unknown> = {}
    for (const [path, message] of Object.entries(form.errors.value)) {
      const names = path.replaceAll('[', '.').replaceAll(']', '').split('.')
      let branch = tree
      names.forEach((name, index) => { if (index === names.length - 1) branch[name] = { message }; else { if (!(name in branch)) branch[name] = {}; branch = branch[name] as Record<string, unknown> } })
    }
    return tree as FieldErrors<T>
  })
  const observe = ((input?: keyof T | ((values: T) => void)) => typeof input === 'function' ? { unsubscribe: watch(() => form.values, value => input(value), { deep: true }) } : input === undefined ? form.values : form.values[input]) as UseFormReturn<T>['watch']
  const api: UseFormReturn<T> = {
    control: form,
    get formState() { return { errors: errors.value, isDirty: form.meta.value.dirty, isValid: form.meta.value.valid, isSubmitting: form.isSubmitting.value, submitCount: form.submitCount.value, isSubmitSuccessful: form.submitCount.value > 0 && form.meta.value.valid && !form.isSubmitting.value } },
    handleSubmit: (submit, invalid) => form.handleSubmit(submit, () => invalid?.(errors.value)),
    reset: values => form.resetForm(values === undefined ? undefined : { values }),
    setError: (name, error) => form.setErrors({ [name]: error.message } as Parameters<typeof form.setErrors>[0]),
    setFocus: name => elements.get(name)?.focus(),
    register: name => ({ name, value: read(name) as PathValue<T, typeof name>, onChange: event => { const input = event.target as HTMLInputElement; form.setFieldValue(name, (input.type === 'checkbox' ? input.checked : input.value) as PathValue<T, typeof name>, options.mode === 'onChange' || options.mode === 'onTouched' && form.isFieldTouched(name)) }, onBlur: () => { form.setFieldTouched(name, true); if (options.mode !== 'onSubmit') void form.validateField(name) }, ref: node => { const element = toElement(node); if (element) elements.set(name, element); else elements.delete(name) } }),
    getValues: ((name?: string) => name === undefined ? form.values : read(name)) as UseFormReturn<T>['getValues'],
    trigger: async name => name === undefined ? (await form.validate()).valid : (await form.validateField(name)).valid,
    watch: observe,
  }
  return computed(() => api)
}
export const FormFieldContext = createContext<{ name: string; error?: string } | undefined>(undefined)
export type ControllerRenderProps<T extends FieldValues, N extends Path<T>> = { field: { name: N; value: PathValue<T, N>; onChange: (value: PathValue<T, N> | Event) => void; onBlur: () => void; ref: (element: unknown) => void }; fieldState: { error?: FieldError; invalid: boolean }; formState: UseFormReturn<T>['formState'] }
export type ControllerProps<T extends FieldValues = FieldValues, N extends Path<T> = Path<T>> = { control: FormContext<T>; name: N; render: (props: ControllerRenderProps<T, N>) => VNodeChild; disabled?: boolean }
const ControllerComponent = defineUi<ControllerProps>('Controller', ['control', 'name', 'render', 'disabled'], (props) => {
  const field = useField(() => props.name, undefined, { form: props.control, validateOnValueUpdate: true })
  const change = (value: unknown) => field.handleChange(value)
  return () => <FormFieldContext.Provider value={{ name: props.name, error: field.errorMessage.value }}>{props.render({ field: { name: props.name, value: field.value.value, onChange: change, onBlur: () => field.handleBlur(), ref: () => {} }, fieldState: { error: field.errorMessage.value === undefined ? undefined : { message: field.errorMessage.value }, invalid: !field.meta.valid }, formState: { errors: {}, isDirty: props.control.meta.value.dirty, isValid: props.control.meta.value.valid, isSubmitting: props.control.isSubmitting.value, submitCount: props.control.submitCount.value, isSubmitSuccessful: false } })}</FormFieldContext.Provider>
})
export const Controller = ControllerComponent as unknown as <T extends FieldValues, N extends Path<T>>(props: ControllerProps<T, N>) => VNode
const FormProviderComponent = defineUi<{ control: FormContext<FieldValues> }>('FormProvider', ['control'], (_props, { slots }) => () => slots.default?.())
export const FormProvider = FormProviderComponent as unknown as <T extends FieldValues>(props: UseFormReturn<T>) => VNode
export function useWatch<T extends FieldValues, K extends keyof T>(source: MaybeRefOrGetter<{ control: FormContext<T>; name: K }>) { return computed(() => toValue(source).control.values[toValue(source).name]) }
export function useFieldArray<T extends FieldValues, K extends keyof T>(source: MaybeRefOrGetter<{ control: FormContext<T>; name: K }>) {
  // 字段数组拥有稳定标识，增删后仍由同一表单验证整个数组。
  const options = toValue(source)
  const ids = new WeakMap<object, string>()
  let nextId = 0
  type Item = T[K] extends (infer I)[] ? I : never
  const list = computed(() => options.control.values[options.name] as Item[])
  const set = (value: Item[]) => options.control.setFieldValue(options.name as unknown as Path<T>, value as never)
  return computed(() => ({ fields: list.value.map(item => { const object = item as object; if (!ids.has(object)) ids.set(object, String(nextId++)); return { ...object, id: ids.get(object)! } as Item & { id: string } }), append: (item: Item) => set([...list.value, item]), remove: (index: number) => set(list.value.filter((_, itemIndex) => itemIndex !== index)) }))
}
