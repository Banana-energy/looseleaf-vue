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
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
export const meta = {
  title: "Vue Hook Form: switch" as const,
  description: "shadcn's `form-rhf-switch`: a boolean switch that the schema insists on. Submit with it off and the switch turns red pencil with its message in the text column." as const,
  layout: "center" as const
};
const formSchema = z.object({
  twoFactor: z.boolean().refine(val => val === true, {
    message: "It is highly recommended to enable two-factor authentication." as const
  })
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof formSchema>>(() => ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      twoFactor: false
    }
  }));
  return () => {
    function onSubmit(data: z.infer<typeof formSchema>) {
      toast("You submitted the following values:", {
        toasterId: "form-rhf-switch" as const,
        description: <pre class="mt-2 w-[320px] overflow-x-auto bg-paper-shade p-4 font-mono text-sm text-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>,
        position: "bottom-right" as const
      });
    }
    return <Card class="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your account security preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-switch" onSubmit={form.value.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller name="twoFactor" control={form.value.control} render={({
              field,
              fieldState
            }) => <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel for="form-rhf-switch-twoFactor">Multi-factor authentication</FieldLabel>
                    <FieldDescription>Enable multi-factor authentication to secure your account.</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                  <Switch id="form-rhf-switch-twoFactor" name={field.name} checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.invalid} />
                </Field>} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.value.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-switch">
            Save
          </Button>
        </Field>
      </CardFooter>
      <Toaster id="form-rhf-switch" />
    </Card>;
  };
});
export default Example;
