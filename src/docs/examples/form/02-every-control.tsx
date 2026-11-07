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
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
export const meta = {
  title: "Every control" as const,
  description: "FormControl hands its id, aria-describedby and aria-invalid to whatever it wraps, so a Select, a Radio Group, a Checkbox, a Switch and a Slider go red the same way an Input does. A slider is not a labelable element: its FormLabel gets an id and the Slider points at it with aria-labelledby." as const,
  layout: "stack" as const,
  height: 460
};
const schema = z.object({
  role: z.string().min(1, "Pick a role."),
  plan: z.enum(["starter", "studio"], {
    message: "Choose a plan." as const
  }),
  terms: z.boolean().refine(v => v, "You must accept the terms."),
  digest: z.boolean(),
  pages: z.array(z.number()).refine(v => v[0] >= 5, "Aim for at least 5 pages a day.")
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof schema>>(() => ({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "" as const,
      terms: false,
      digest: true,
      pages: [20]
    }
  }));
  const saved = shallowRef(initialState(""));
  const setSaved = stateSetter(saved);
  return () => {
    return <Form {...domProps(form.value)}>
      <form onSubmit={form.value.handleSubmit(v => setSaved(`Saved: ${v.role}, ${v.plan}, ${v.pages[0]} pages`))} class="grid w-full max-w-sm gap-5" novalidate>
        <FormField control={form.value.control} name="role" render={({
          field
        }) => <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Pick a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper">
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>} />
        <FormField control={form.value.control} name="plan" render={({
          field
        }) => <FormItem>
              <FormLabel>Plan</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} value={field.value} class="gap-2.5" aria-label="Plan">
                  {["starter", "studio"].map(v => <FormItem key={v} class="flex items-center gap-3">
                      <FormControl>
                        <RadioGroupItem value={v} />
                      </FormControl>
                      <FormLabel class="capitalize">{v}</FormLabel>
                    </FormItem>)}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>} />
        <FormField control={form.value.control} name="pages" render={({
          field
        }) => <FormItem>
              <FormLabel id="pages-label">Pages per day: {field.value[0]}</FormLabel>
              <FormControl>
                <Slider min={1} max={60} value={field.value} onValueChange={field.onChange} aria-labelledby="pages-label" />
              </FormControl>
              <FormMessage />
            </FormItem>} />
        <FormField control={form.value.control} name="digest" render={({
          field
        }) => <FormItem class="flex items-center justify-between gap-4">
              <div class="grid gap-1">
                <FormLabel>Weekly digest</FormLabel>
                <FormDescription>Sunday, in pencil.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>} />
        <FormField control={form.value.control} name="terms" render={({
          field
        }) => <FormItem>
              <div class="flex items-center gap-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>I accept the small print</FormLabel>
              </div>
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
