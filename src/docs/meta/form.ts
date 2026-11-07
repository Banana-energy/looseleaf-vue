// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import type { ComponentDoc } from "@/docs/types";
export default {
  slug: "form" as const,
  title: "Form" as const,
  category: "Forms" as const,
  description: "vee-validate wired to the drawn controls, exactly like shadcn's Form. FormControl gives the control its id, aria-describedby and aria-invalid, so an Input, Select, Checkbox or Switch turns red pencil when the field has an error, its label follows, and FormMessage writes the message under it with a wavy red underline." as const,
  status: "stable" as const,
  upstream: "form" as const,
  parts: [{
    name: "Form" as const,
    description: "vee-validate's FormProvider: spread the result of `useForm()` on it." as const
  }, {
    name: "FormField" as const,
    description: "A vee-validate Controller that also tells its children which field they belong to. Same props as Controller (`control`, `name`, `render`)." as const
  }, {
    name: "FormItem" as const,
    description: "A grid with a gap and a fresh id for the label, control, description and message of one field." as const
  }, {
    name: "FormLabel" as const,
    description: "A Label whose `for` is the control's id; it is red pencil while the field has an error." as const
  }, {
    name: "FormControl" as const,
    description: "Wrap the control (a Slot): it receives `id`, `aria-describedby` (the description, plus the message while there is an error) and `aria-invalid`." as const
  }, {
    name: "FormDescription" as const,
    description: "Muted help text, wired into aria-describedby." as const
  }, {
    name: "FormMessage" as const,
    description: "The field's error (or your own children), drawn with a wavy red pencil underline. Renders nothing when there is nothing to say." as const,
    props: [{
      name: "seed" as const,
      type: "string | number" as const,
      description: "Pins the hand of the underline. Default: from useId()." as const
    }]
  }, {
    name: "useFormField" as const,
    description: "Hook for your own parts inside a FormItem: `{ id, name, formItemId, formDescriptionId, formMessageId, error, invalid, isDirty, isTouched }`." as const
  }],
  a11y: ["FormLabel is a real <label for>, FormControl puts the same id on the control, and aria-describedby points at the description and (while invalid) the message; aria-invalid is set for you.", "FormMessage is a <p> that appears next to the control with its id in aria-describedby, so a screen reader reads it with the control when focus arrives. Wrap it in an element with role=\"alert\" (or use Field's FieldError) if you want it announced the moment it appears.", "Not every control can be named by FormLabel's `for`: a Slider (role=slider on a span) or a Rating (a radiogroup) needs `aria-labelledby` pointing at an `id` you give the FormLabel, or an `aria-label`. FormControl's id, aria-describedby and aria-invalid do reach a Slider's thumb, a Rating's group and a RadioGroup's group (whose radios turn red).", "Errors do not rely on color alone: the message text, the wavy underline and the control's own drawn state (red box, a bang on text fields) all say it.", "Validation timing is vee-validate's (`mode`: onSubmit by default, onChange, onBlur ...); the drawn components do not re-render their ink when it changes, only their state layers.", "Windows high contrast: the ink is replaced by real borders, and the message gets a wavy text underline."],
  usage: `import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "vee-validate"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const schema = z.object({ email: z.string().email("Enter an address like ada@notes.dev.") })

export function Example() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.warn)} className="grid max-w-sm gap-4" noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}`,
  related: ["field", "input", "select", "checkbox", "label"]
} satisfies ComponentDoc;
