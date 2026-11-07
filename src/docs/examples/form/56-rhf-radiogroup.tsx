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
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toaster } from "@/components/ui/sonner";
export const meta = {
  title: "Vue Hook Form: radio group" as const,
  description: "shadcn's `form-rhf-radiogroup`: choice cards (a FieldLabel around each Field) in a controlled RadioGroup. `aria-invalid` on the group and on each item paints the whole set red when nothing is chosen." as const,
  layout: "center" as const
};
const plans = [{
  id: "starter" as const,
  title: "Starter (100K tokens/month)" as const,
  description: "For everyday use with basic features." as const
}, {
  id: "pro" as const,
  title: "Pro (1M tokens/month)" as const,
  description: "For advanced AI usage with more features." as const
}, {
  id: "enterprise" as const,
  title: "Enterprise (Unlimited tokens)" as const,
  description: "For large teams and heavy usage." as const
}] as const;
const formSchema = z.object({
  plan: z.string().min(1, "You must select a subscription plan to continue.")
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof formSchema>>(() => ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: "" as const
    }
  }));
  return () => {
    function onSubmit(data: z.infer<typeof formSchema>) {
      toast("You submitted the following values:", {
        toasterId: "form-rhf-radiogroup" as const,
        description: <pre class="mt-2 w-[320px] overflow-x-auto bg-paper-shade p-4 font-mono text-sm text-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>,
        position: "bottom-right" as const
      });
    }
    return <Card class="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>See pricing and features for each plan.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-radiogroup" onSubmit={form.value.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller name="plan" control={form.value.control} render={({
              field,
              fieldState
            }) => <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend>Plan</FieldLegend>
                  <FieldDescription>You can upgrade or downgrade your plan at any time.</FieldDescription>
                  <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange} aria-invalid={fieldState.invalid}>
                    {plans.map(plan => <FieldLabel key={plan.id} for={`form-rhf-radiogroup-${plan.id}`}>
                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                          <FieldContent>
                            <FieldTitle>{plan.title}</FieldTitle>
                            <FieldDescription>{plan.description}</FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value={plan.id} id={`form-rhf-radiogroup-${plan.id}`} aria-invalid={fieldState.invalid} />
                        </Field>
                      </FieldLabel>)}
                  </RadioGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldSet>} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.value.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-radiogroup">
            Save
          </Button>
        </Field>
      </CardFooter>
      <Toaster id="form-rhf-radiogroup" />
    </Card>;
  };
});
export default Example;
