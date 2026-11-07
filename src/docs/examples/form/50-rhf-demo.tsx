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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Toaster } from "@/components/ui/sonner";
export const meta = {
  title: "Vue Hook Form: bug report" as const,
  description: "shadcn's `form-rhf-demo`, the Field way to wire a form: `Controller` hands `field` and `fieldState` to a render prop, `data-invalid` on the Field and `aria-invalid` on the control turn it red, and `FieldError` prints the zod message. Submit it empty, then fill it in." as const,
  layout: "center" as const
};
const formSchema = z.object({
  title: z.string().min(5, "Bug title must be at least 5 characters.").max(32, "Bug title must be at most 32 characters."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(100, "Description must be at most 100 characters.")
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof formSchema>>(() => ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "" as const,
      description: "" as const
    }
  }));
  return () => {
    function onSubmit(data: z.infer<typeof formSchema>) {
      toast("You submitted the following values:", {
        toasterId: "form-rhf-demo" as const,
        description: <pre class="mt-2 w-[320px] overflow-x-auto bg-paper-shade p-4 font-mono text-sm text-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>,
        position: "bottom-right" as const
      });
    }
    return <Card class="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>Help us improve by reporting bugs you encounter.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.value.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller name="title" control={form.value.control} render={({
              field,
              fieldState
            }) => <Field data-invalid={fieldState.invalid}>
                  <FieldLabel for="form-rhf-demo-title">Bug Title</FieldLabel>
                  <Input {...domProps(field)} id="form-rhf-demo-title" aria-invalid={fieldState.invalid} placeholder="Login button not working on mobile" autocomplete="off" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>} />
            <Controller name="description" control={form.value.control} render={({
              field,
              fieldState
            }) => <Field data-invalid={fieldState.invalid}>
                  <FieldLabel for="form-rhf-demo-description">Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea {...domProps(field)} id="form-rhf-demo-description" placeholder="I'm having an issue with the login button on mobile." rows={6} class="min-h-24 resize-none" aria-invalid={fieldState.invalid} />
                    <InputGroupAddon align="block-end">
                      <InputGroupText class="tabular-nums">{field.value.length}/100 characters</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>Include steps to reproduce, expected behavior, and what actually happened.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.value.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
      <Toaster id="form-rhf-demo" />
    </Card>;
  };
});
export default Example;
