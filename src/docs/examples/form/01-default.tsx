// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { zodResolver } from "@/lib/schema-bridge";
import { useForm } from "@/lib/form-bridge";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
export const meta = {
  title: "Default" as const,
  description: "vee-validate with a zod schema. Press Save with the fields empty: the labels and boxes turn red pencil and each message is written under its field with a wavy underline. Fix one and its message goes on the next change." as const,
  layout: "stack" as const
};
const schema = z.object({
  username: z.string().min(2, "Your name needs at least 2 letters."),
  email: z.string().email("Enter an address like ada@notes.dev.")
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof schema>>(() => ({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "" as const,
      email: "" as const
    }
  }));
  const saved = shallowRef(initialState(""));
  const setSaved = stateSetter(saved);
  return () => {
    return <Form {...domProps(form.value)}>
      <form onSubmit={form.value.handleSubmit(v => setSaved(`Saved ${v.username} <${v.email}>`))} class="grid w-full max-w-sm gap-5" novalidate>
        <FormField control={form.value.control} name="username" render={({
          field
        }) => <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Ada" {...domProps(field)} />
              </FormControl>
              <FormDescription>Shown on the pages you write.</FormDescription>
              <FormMessage />
            </FormItem>} />
        <FormField control={form.value.control} name="email" render={({
          field
        }) => <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ada@notes.dev" {...domProps(field)} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
        <div class="flex items-center gap-3">
          <Button type="submit">Save</Button>
          <span role="status" class="text-sm text-ink-muted">
            {saved.value}
          </span>
        </div>
      </form>
    </Form>;
  };
});
export default Example;
