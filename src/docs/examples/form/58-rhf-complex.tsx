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
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
export const meta = {
  title: "Vue Hook Form: every control" as const,
  description: "shadcn's `form-rhf-complex`: a radio card set, a select, a checkbox group and a switch in one form, four kinds of state and four `Controller`s. The schema wants a billing period and at least one add-on." as const,
  layout: "center" as const
};
const addons = [{
  id: "analytics" as const,
  title: "Analytics" as const,
  description: "Advanced analytics and reporting" as const
}, {
  id: "backup" as const,
  title: "Backup" as const,
  description: "Automated daily backups" as const
}, {
  id: "support" as const,
  title: "Priority Support" as const,
  description: "24/7 premium customer support" as const
}] as const;
const formSchema = z.object({
  plan: z.string().min(1, "Please select a subscription plan").refine(value => ["basic", "pro"].includes(value), {
    message: "Invalid plan selection. Please choose Basic or Pro" as const
  }),
  billingPeriod: z.string().min(1, "Please select a billing period"),
  addons: z.array(z.string()).min(1, "Please select at least one add-on").max(3, "You can select up to 3 add-ons").refine(value => value.every(addon => addons.some(a => a.id === addon)), {
    message: "You selected an invalid add-on" as const
  }),
  emailNotifications: z.boolean()
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof formSchema>>(() => ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: "basic" as const,
      billingPeriod: "" as const,
      addons: [],
      emailNotifications: false
    }
  }));
  return () => {
    function onSubmit(data: z.infer<typeof formSchema>) {
      toast("You submitted the following values:", {
        toasterId: "form-rhf-complex" as const,
        description: <pre class="mt-2 w-[320px] overflow-x-auto bg-paper-shade p-4 font-mono text-sm text-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>,
        position: "bottom-right" as const
      });
    }
    return <Card class="w-full max-w-sm">
      <CardHeader class="border-b">
        <CardTitle>You&apos;re almost there!</CardTitle>
        <CardDescription>Choose your subscription plan and billing period.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-complex" onSubmit={form.value.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller name="plan" control={form.value.control} render={({
              field,
              fieldState
            }) => {
              const isInvalid = fieldState.invalid;
              return <FieldSet data-invalid={isInvalid}>
                    <FieldLegend variant="label">Subscription Plan</FieldLegend>
                    <FieldDescription>Choose your subscription plan.</FieldDescription>
                    <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange} aria-invalid={isInvalid}>
                      <FieldLabel for="form-rhf-complex-basic">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>Basic</FieldTitle>
                            <FieldDescription>For individuals and small teams</FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value="basic" id="form-rhf-complex-basic" />
                        </Field>
                      </FieldLabel>
                      <FieldLabel for="form-rhf-complex-pro">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>Pro</FieldTitle>
                            <FieldDescription>For businesses with higher demands</FieldDescription>
                          </FieldContent>
                          <RadioGroupItem value="pro" id="form-rhf-complex-pro" />
                        </Field>
                      </FieldLabel>
                    </RadioGroup>
                    {isInvalid && <FieldError errors={[fieldState.error]} />}
                  </FieldSet>;
            }} />
            <FieldSeparator />
            <Controller name="billingPeriod" control={form.value.control} render={({
              field,
              fieldState
            }) => <Field data-invalid={fieldState.invalid}>
                  <FieldLabel for="form-rhf-complex-billingPeriod">Billing Period</FieldLabel>
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="form-rhf-complex-billingPeriod" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>Choose how often you want to be billed.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>} />
            <FieldSeparator />
            <Controller name="addons" control={form.value.control} render={({
              field,
              fieldState
            }) => <FieldSet>
                  <FieldLegend>Add-ons</FieldLegend>
                  <FieldDescription>Select additional features you&apos;d like to include.</FieldDescription>
                  <FieldGroup data-slot="checkbox-group">
                    {addons.map(addon => <Field key={addon.id} orientation="horizontal" data-invalid={fieldState.invalid}>
                        <Checkbox id={`form-rhf-complex-${addon.id}`} name={field.name} aria-invalid={fieldState.invalid} checked={field.value.includes(addon.id)} onCheckedChange={checked => {
                    const newValue = checked ? [...field.value, addon.id] : field.value.filter(value => value !== addon.id);
                    field.onChange(newValue);
                    field.onBlur();
                  }} />
                        <FieldContent>
                          <FieldLabel for={`form-rhf-complex-${addon.id}`}>{addon.title}</FieldLabel>
                          <FieldDescription>{addon.description}</FieldDescription>
                        </FieldContent>
                      </Field>)}
                  </FieldGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldSet>} />
            <FieldSeparator />
            <Controller name="emailNotifications" control={form.value.control} render={({
              field,
              fieldState
            }) => <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel for="form-rhf-complex-emailNotifications">Email Notifications</FieldLabel>
                    <FieldDescription>Receive email updates about your subscription</FieldDescription>
                  </FieldContent>
                  <Switch id="form-rhf-complex-emailNotifications" name={field.name} checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter class="border-t">
        <Field>
          <Button type="submit" form="form-rhf-complex">
            Save Preferences
          </Button>
          <Button type="button" variant="outline" onClick={() => form.value.reset()}>
            Reset
          </Button>
        </Field>
      </CardFooter>
      <Toaster id="form-rhf-complex" />
    </Card>;
  };
});
export default Example;
