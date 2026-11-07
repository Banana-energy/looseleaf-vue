import { computed, useId } from 'vue'
import { Controller as FormField, FormProvider as Form, FormFieldContext } from '@/lib/form-bridge'
import { Slot } from '@/lib/primitive-adapter'
import { Label } from './label'
import { defineUi, omitProps } from '@/lib/component'
import { createContext, useContext } from '@/lib/composables'
import { useInk } from '@/lib/ink/vue'
import { fieldErrorRecipe } from '@/lib/ink/recipes/field-error-ink'
import { cn } from '@/lib/utils'
import type * as UI from '@/lib/types'

const ItemContext = createContext<string | undefined>(undefined)
// 字段、标签与错误提示共享同一个 vee-validate 字段上下文。
function useFormField() {
  const field = useContext(FormFieldContext)
  const id = useContext(ItemContext)
  return computed(() => ({ ...field.value, formItemId: `${id.value}-form-item`, formDescriptionId: `${id.value}-form-item-description`, formMessageId: `${id.value}-form-item-message` }))
}
const FormItem = defineUi<UI.ComponentProps<'div'>>('FormItem', ['class'], (props, { slots }) => { const id = useId(); return () => <ItemContext.Provider value={id}><div data-slot="form-item" {...props} class={cn('grid gap-2', props.class)}>{slots.default?.()}</div></ItemContext.Provider> })
const FormLabel = defineUi<UI.ComponentProps<typeof Label>>('FormLabel', ['class'], (props, { slots }) => { const field = useFormField(); return () => <Label {...props} data-slot="form-label" data-error={!!field.value.error} for={field.value.formItemId} class={cn('data-[error=true]:text-destructive', props.class)}>{slots.default?.()}</Label> })
const FormControl = defineUi<UI.ComponentProps<typeof Slot.Root>>('FormControl', [], (props, { slots }) => { const field = useFormField(); return () => <Slot.Root {...props} data-slot="form-control" id={field.value.formItemId} aria-describedby={field.value.error ? `${field.value.formDescriptionId} ${field.value.formMessageId}` : field.value.formDescriptionId} aria-invalid={!!field.value.error}>{slots.default?.()}</Slot.Root> })
const FormDescription = defineUi<UI.ComponentProps<'p'>>('FormDescription', ['class'], (props, { slots }) => { const field = useFormField(); return () => <p {...props} data-slot="form-description" id={field.value.formDescriptionId} class={cn('text-sm text-muted-foreground', props.class)}>{slots.default?.()}</p> })
const FormMessage = defineUi<UI.ComponentProps<'p'> & { seed?: string | number }>('FormMessage', ['class', 'seed'], (props, { slots }) => {
  const field = useFormField()
  const ink = useInk(() => ({ recipe: fieldErrorRecipe, params: {}, kind: 'underline', seed: props.seed, still: true }))
  return () => { const body = field.value.error || slots.default?.(); return body ? <p {...omitProps(props, ['class', 'seed'])} data-slot="form-message" id={field.value.formMessageId} ref={ink.hostRef} {...ink.hostProps.value} class={cn('relative isolate w-fit max-w-full pb-1 text-sm text-destructive outline-hidden forced-colors:underline forced-colors:decoration-wavy', props.class)}>{ink.node.value}{body}</p> : null }
})
export { Form, FormItem, FormField, FormLabel, FormControl, FormDescription, FormMessage, useFormField }
