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
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "Vue Hook Form: textarea" as const,
  description: "shadcn's `form-rhf-textarea`: a ruled textarea with a length rule on both ends. Too short and too long each get their own sentence." as const,
  layout: "center" as const
};
const formSchema = z.object({
  about: z.string().min(10, "Please provide at least 10 characters.").max(200, "Please keep it under 200 characters.")
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof formSchema>>(() => ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about: "" as const
    }
  }));
  return () => {
    function onSubmit(data: z.infer<typeof formSchema>) {
      toast("You submitted the following values:", {
        toasterId: "form-rhf-textarea" as const,
        description: <pre class="mt-2 w-[320px] overflow-x-auto bg-paper-shade p-4 font-mono text-sm text-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>,
        position: "bottom-right" as const
      });
    }
    return <Card class="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Personalization</CardTitle>
        <CardDescription>Customize your experience by telling us more about yourself.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-textarea" onSubmit={form.value.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller name="about" control={form.value.control} render={({
              field,
              fieldState
            }) => <Field data-invalid={fieldState.invalid}>
                  <FieldLabel for="form-rhf-textarea-about">More about you</FieldLabel>
                  <Textarea {...domProps(field)} id="form-rhf-textarea-about" aria-invalid={fieldState.invalid} placeholder="I'm a software engineer..." class="min-h-[120px]" />
                  <FieldDescription>Tell us more about yourself. This will be used to help us personalize your experience.</FieldDescription>
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
          <Button type="submit" form="form-rhf-textarea">
            Save
          </Button>
        </Field>
      </CardFooter>
      <Toaster id="form-rhf-textarea" />
    </Card>;
  };
});
export default Example;
