// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { zodResolver } from "@/lib/schema-bridge";
import { Controller, useFieldArray, useForm } from "@/lib/form-bridge";
import { toast } from "@/lib/sonner-primitive";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Toaster } from "@/components/ui/sonner";
export const meta = {
  title: "Vue Hook Form: array" as const,
  description: "shadcn's `form-rhf-array`: `useFieldArray` for a list of emails, each an InputGroup with a remove button inside its box. Add up to five; the array's own min and max errors are printed under the list." as const,
  layout: "center" as const
};
const formSchema = z.object({
  emails: z.array(z.object({
    address: z.string().email("Enter a valid email address.")
  })).min(1, "Add at least one email address.").max(5, "You can add up to 5 email addresses.")
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof formSchema>>(() => ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: [{
        address: "" as const
      }, {
        address: "" as const
      }]
    }
  }));
  const _hook1 = useFieldArray(() => ({
    control: form.value.control,
    name: "emails" as const
  }));
  const fields = computed(() => _hook1.value.fields);
  const append = computed(() => _hook1.value.append);
  const remove = computed(() => _hook1.value.remove);
  return () => {
    function onSubmit(data: z.infer<typeof formSchema>) {
      toast("You submitted the following values:", {
        toasterId: "form-rhf-array" as const,
        description: <pre class="mt-2 w-[320px] overflow-x-auto bg-paper-shade p-4 font-mono text-sm text-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>,
        position: "bottom-right" as const
      });
    }
    return <Card class="w-full sm:max-w-md">
      <CardHeader class="border-b">
        <CardTitle>Contact Emails</CardTitle>
        <CardDescription>Manage your contact email addresses.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-array" onSubmit={form.value.handleSubmit(onSubmit)}>
          <FieldSet class="gap-4">
            <FieldLegend variant="label">Email Addresses</FieldLegend>
            <FieldDescription>Add up to 5 email addresses where we can contact you.</FieldDescription>
            <FieldGroup class="gap-4">
              {fields.value.map((field, index) => <Controller key={field.id} name={`emails.${index}.address`} control={form.value.control} render={({
                field: controllerField,
                fieldState
              }) => <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupInput {...domProps(controllerField)} id={`form-rhf-array-email-${index}`} aria-invalid={fieldState.invalid} aria-label={`Email address ${index + 1}`} placeholder="name@example.com" type="email" autocomplete="email" />
                          {fields.value.length > 1 && <InputGroupAddon align="inline-end">
                              <InputGroupButton type="button" variant="ghost" size="icon-xs" onClick={() => remove.value(index)} aria-label={`Remove email ${index + 1}`}>
                                <Icon name="x" />
                              </InputGroupButton>
                            </InputGroupAddon>}
                        </InputGroup>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </FieldContent>
                    </Field>} />)}
              <Button type="button" variant="outline" size="sm" onClick={() => append.value({
                address: "" as const
              })} disabled={fields.value.length >= 5}>
                Add Email Address
              </Button>
            </FieldGroup>
            {form.value.formState.errors.emails?.root && <FieldError errors={[form.value.formState.errors.emails.root]} />}
          </FieldSet>
        </form>
      </CardContent>
      <CardFooter class="border-t">
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.value.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-array">
            Save
          </Button>
        </Field>
      </CardFooter>
      <Toaster id="form-rhf-array" />
    </Card>;
  };
});
export default Example;
