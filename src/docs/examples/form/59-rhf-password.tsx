// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { zodResolver } from "@/lib/schema-bridge";
import { Controller, useForm, useWatch } from "@/lib/form-bridge";
import { toast } from "@/lib/sonner-primitive";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
export const meta = {
  title: "Vue Hook Form: password" as const,
  description: "shadcn's `form-rhf-password`: `useWatch` feeds a strength meter and a live checklist while the schema guards the submit. The bar is a marker pass that changes ink as the password improves; a met rule is a pencilled tick, an open one a cross, and each says so in words for a screen reader." as const,
  layout: "center" as const
};
const passwordRequirements = [{
  id: "length" as const,
  label: "At least 8 characters" as const,
  test: (val: string) => val.length >= 8
}, {
  id: "lowercase" as const,
  label: "One lowercase letter" as const,
  test: (val: string) => /[a-z]/.test(val)
}, {
  id: "uppercase" as const,
  label: "One uppercase letter" as const,
  test: (val: string) => /[A-Z]/.test(val)
}, {
  id: "number" as const,
  label: "One number" as const,
  test: (val: string) => /\d/.test(val)
}, {
  id: "special" as const,
  label: "One special character" as const,
  test: (val: string) => /[!@#$%^&*(),.?":{}|<>]/.test(val)
}];
const formSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").refine(val => /[a-z]/.test(val), "Password must contain at least one lowercase letter").refine(val => /[A-Z]/.test(val), "Password must contain at least one uppercase letter").refine(val => /\d/.test(val), "Password must contain at least one number").refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), "Password must contain at least one special character")
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const form = useForm<z.infer<typeof formSchema>>(() => ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "" as const
    }
  }));
  const password = useWatch(() => ({
    control: form.value.control,
    name: "password" as const
  }));
  const metRequirements = computed(() => passwordRequirements.filter(req => req.test(password.value || "")));
  const strengthPercentage = computed(() => metRequirements.value.length / passwordRequirements.length * 100);
  const strengthTone = computed(() => strengthPercentage.value <= 40 ? "marker" as const : strengthPercentage.value <= 80 ? "hi" as const : "green" as const);
  const allRequirementsMet = computed(() => metRequirements.value.length === passwordRequirements.length);
  return () => {
    function onSubmit(data: z.infer<typeof formSchema>) {
      toast("You submitted the following values:", {
        toasterId: "form-rhf-password" as const,
        description: <pre class="mt-2 w-[320px] overflow-x-auto bg-paper-shade p-4 font-mono text-sm text-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>,
        position: "bottom-right" as const
      });
    }
    return <Card class="w-full sm:max-w-md">
      <CardHeader class="border-b">
        <CardTitle>Create Password</CardTitle>
        <CardDescription>Choose a strong password to secure your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-password" onSubmit={form.value.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller name="password" control={form.value.control} render={({
              field,
              fieldState
            }) => <Field data-invalid={fieldState.invalid}>
                  <FieldLabel for="form-rhf-password-input">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...domProps(field)} id="form-rhf-password-input" type="password" placeholder="Enter your password" aria-invalid={fieldState.invalid} autocomplete="new-password" />
                    <InputGroupAddon align="inline-end">
                      <Icon name="check" class={allRequirementsMet.value ? "text-green" as const : "text-muted-foreground" as const} />
                    </InputGroupAddon>
                  </InputGroup>
                  <div class="space-y-2">
                    <Progress value={strengthPercentage.value} tone={strengthTone.value} aria-label="Password strength" />
                    <div class="space-y-1.5">
                      {passwordRequirements.map(requirement => {
                    const isMet = requirement.test(password.value || "");
                    return <div key={requirement.id} class="flex items-center gap-2 text-sm">
                            <Icon name={isMet ? "check" as const : "x" as const} class={isMet ? "size-4 text-green" as const : "size-4 text-muted-foreground" as const} />
                            <span class={isMet ? "text-foreground" as const : "text-muted-foreground" as const}>{requirement.label}</span>
                            <span class="sr-only">{isMet ? "(met)" as const : "(not met)" as const}</span>
                          </div>;
                  })}
                    </div>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>} />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter class="border-t">
        <Field>
          <Button type="submit" form="form-rhf-password">
            Create Password
          </Button>
          <Button type="button" variant="outline" onClick={() => form.value.reset()}>
            Reset
          </Button>
        </Field>
      </CardFooter>
      <Toaster id="form-rhf-password" />
    </Card>;
  };
});
export default Example;
