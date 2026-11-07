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
  title: "Server errors" as const,
  description: "An error does not have to come from the schema: after a pretend request `setError` puts \"already taken\" on the field, and the same label, box and underline appear. Change the text and it clears itself." as const,
  layout: "stack" as const
};
const schema = z.object({
  handle: z.string().min(3, "At least 3 characters.").regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers and _ only.")
});
const taken = ["ada", "grace", "notes"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof schema>>(() => ({
    resolver: zodResolver(schema),
    defaultValues: {
      handle: "notes" as const
    },
    mode: "onChange" as const
  }));
  const pending = shallowRef(initialState(false));
  const setPending = stateSetter(pending);
  const done = shallowRef(initialState(""));
  const setDone = stateSetter(done);
  return () => {
    async function onSubmit(v: z.infer<typeof schema>) {
      if (pending.value) return;
      setPending(true);
      setDone("");
      await new Promise(r => setTimeout(r, 400));
      setPending(false);
      if (taken.includes(v.handle)) form.value.setError("handle", {
        message: `@${v.handle} is already taken.`
      });else setDone(`@${v.handle} is yours.`);
    }
    return <Form {...domProps(form.value)}>
      <form onSubmit={form.value.handleSubmit(onSubmit)} class="grid w-full max-w-sm gap-4" novalidate>
        <FormField control={form.value.control} name="handle" render={({
          field
        }) => <FormItem>
              <FormLabel>Handle</FormLabel>
              <FormControl>
                <Input {...domProps(field)} autocomplete="off" />
              </FormControl>
              <FormDescription>Try "notes" (taken), then something else.</FormDescription>
              <FormMessage />
            </FormItem>} />
        <div class="flex items-center gap-3">
          <Button type="submit" aria-busy={pending.value}>
            {pending.value ? "Checking" as const : "Claim it" as const}
          </Button>
          <span role="status" class="text-sm text-ink-muted">
            {done.value}
          </span>
        </div>
      </form>
    </Form>;
  };
});
export default Example;
