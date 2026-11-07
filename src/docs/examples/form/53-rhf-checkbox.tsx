// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { zodResolver } from "@/lib/schema-bridge";
import { Controller, useForm } from "@/lib/form-bridge";
import { toast } from "@/lib/sonner-primitive";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Toaster } from "@/components/ui/sonner";
export const meta = {
  title: "Vue Hook Form: checkbox" as const,
  description: "shadcn's `form-rhf-checkbox`: a single boolean box (here disabled and ticked) and a group that collects an array. Untick both notification types and submit to see the group's own error." as const,
  layout: "center" as const
};
const tasks = [{
  id: "push" as const,
  label: "Push notifications" as const
}, {
  id: "email" as const,
  label: "Email notifications" as const
}] as const;
const formSchema = z.object({
  responses: z.boolean(),
  tasks: z.array(z.string()).min(1, "Please select at least one notification type.").refine(value => value.every(task => tasks.some(t => t.id === task)), {
    message: "Invalid notification type selected." as const
  })
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof formSchema>>(() => ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responses: true,
      tasks: []
    }
  }));
  return () => {
    function onSubmit(data: z.infer<typeof formSchema>) {
      toast("You submitted the following values:", {
        toasterId: "form-rhf-checkbox" as const,
        description: <pre class="mt-2 w-[320px] overflow-x-auto bg-paper-shade p-4 font-mono text-sm text-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>,
        position: "bottom-right" as const
      });
    }
    return <Card class="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage your notification preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-checkbox" onSubmit={form.value.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller name="responses" control={form.value.control} render={({
              field,
              fieldState
            }) => <div>
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend variant="label">Responses</FieldLegend>
                    <FieldDescription>Get notified for requests that take time, like research or image generation.</FieldDescription>
                    <FieldGroup data-slot="checkbox-group">
                      <Field orientation="horizontal">
                        <Checkbox id="form-rhf-checkbox-responses" name={field.name} checked={field.value} onCheckedChange={field.onChange} disabled />
                        <FieldLabel for="form-rhf-checkbox-responses" class="font-normal">
                          Push notifications
                        </FieldLabel>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </div>} />
            <FieldSeparator />
            <Controller name="tasks" control={form.value.control} render={({
              field,
              fieldState
            }) => <FieldGroup>
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend variant="label">Tasks</FieldLegend>
                    <FieldDescription>Get notified when tasks you&apos;ve created have updates.</FieldDescription>
                    <FieldGroup data-slot="checkbox-group">
                      {tasks.map(task => <Field key={task.id} orientation="horizontal" data-invalid={fieldState.invalid}>
                          <Checkbox id={`form-rhf-checkbox-${task.id}`} name={field.name} aria-invalid={fieldState.invalid} checked={field.value.includes(task.id)} onCheckedChange={checked => {
                      const newValue = checked ? [...field.value, task.id] : field.value.filter(value => value !== task.id);
                      field.onChange(newValue);
                    }} />
                          <FieldLabel for={`form-rhf-checkbox-${task.id}`} class="font-normal">
                            {task.label}
                          </FieldLabel>
                        </Field>)}
                    </FieldGroup>
                  </FieldSet>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldGroup>} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.value.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-checkbox">
            Save
          </Button>
        </Field>
      </CardFooter>
      <Toaster id="form-rhf-checkbox" />
    </Card>;
  };
});
export default Example;
