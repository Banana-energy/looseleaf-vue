// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { zodResolver } from "@/lib/schema-bridge";
import { useForm } from "@/lib/form-bridge";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Mascot } from "@/components/ui/mascot";
import { Seal } from "@/components/ui/seal";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
const RULES = [{
  key: "length" as const,
  label: "8 or more characters" as const,
  test: (p: string) => p.length >= 8
}, {
  key: "digit" as const,
  label: "A number" as const,
  test: (p: string) => /\d/.test(p)
}, {
  key: "case" as const,
  label: "A capital and a small letter" as const,
  test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p)
}] as const;
const schema = z.object({
  password: z.string().min(8, "Use at least 8 characters.").regex(/\d/, "Add at least one number.").regex(/(?=.*[a-z])(?=.*[A-Z])/, "Mix a capital and a small letter."),
  confirm: z.string().min(1, "Type the password once more.")
}).refine(v => v.password === v.confirm, {
  path: ["confirm"],
  message: "Those two do not match yet." as const
});
type ResetFormValues = z.infer<typeof schema>;
type ResetPasswordValues = Pick<ResetFormValues, "password">;
type ResetPasswordFormProps = Omit<UI.ComponentProps<"div">, "onSubmit"> & {
  onSubmit?: (values: ResetPasswordValues) => void | Promise<void>;
};
const pretend = () => new Promise<void>(resolve => setTimeout(resolve, 700));
const describedBy = (...ids: Array<string | false | undefined>) => ids.filter(Boolean).join(" ") || undefined;
const PasswordInput = defineUi<Omit<UI.ComponentProps<typeof InputGroupInput>, "type"> & {
  toggleLabel?: string;
}>("PasswordInput", ["toggleLabel"], (_props, {
  slots: _slots
}) => {
  const toggleLabel = computed(() => _props["toggleLabel"] === undefined ? "Show password" as const : _props["toggleLabel"]);
  const props = computed(() => omitProps(_props, ["toggleLabel"]));
  const shown = shallowRef(initialState(false));
  const setShown = stateSetter(shown);
  return () => {
    return <InputGroup>
      <InputGroupInput type={shown.value ? "text" as const : "password" as const} {...domProps(props.value)}>{_slots.default?.()}</InputGroupInput>
      <InputGroupAddon align="inline-end" class="has-[>button]:-me-1">
        <InputGroupButton size="icon-sm" class="size-7 compact:size-6 calm:size-6" aria-label={toggleLabel.value} aria-pressed={shown.value} onClick={() => setShown(v => !v)}>
          <Icon name={shown.value ? "eye-off" as const : "eye" as const} size={16} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>;
  };
});
const ResetPasswordForm = defineUi<ResetPasswordFormProps>("ResetPasswordForm", ["class", "onSubmit"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const onSubmit = computed(() => _props["onSubmit"]);
  const props = computed(() => omitProps(_props, ["class", "onSubmit"]));
  const uid = useId();
  const id = computed(() => (name: string) => `${uid}-${name}`);
  const titleRef = shallowRef<HTMLDivElement | null>(null);
  const formError = shallowRef<string | null>(initialState(null));
  const setFormError = stateSetter(formError);
  const saved = shallowRef(initialState(false));
  const setSaved = stateSetter(saved);
  const _hook10 = useForm<ResetFormValues>(() => ({
    resolver: zodResolver(schema),
    mode: "onTouched" as const,
    defaultValues: {
      password: "" as const,
      confirm: "" as const
    }
  }));
  const register = computed(() => _hook10.value.register);
  const handleSubmit = computed(() => _hook10.value.handleSubmit);
  const getValues = computed(() => _hook10.value.getValues);
  const trigger = computed(() => _hook10.value.trigger);
  const watch = computed(() => _hook10.value.watch);
  const errors = computed(() => _hook10.value.formState.errors);
  const isSubmitting = computed(() => _hook10.value.formState.isSubmitting);
  const password = computed(() => watch.value("password"));
  watchDependencies(() => {
    if (saved.value) titleRef.value?.focus();
  }, () => [saved.value], false);
  const submit = computed(() => handleSubmit.value(async ({
    password: next
  }) => {
    setFormError(null);
    try {
      await (onSubmit.value ?? pretend)({
        password: next
      });
      setSaved(true);
    } catch (error) {
      setFormError(error instanceof Error && error.message ? error.message : "We could not save the new password. Ask for a fresh link and try again." as const);
    }
  }));
  return () => {
    if (saved.value) {
      return <div class={cn("flex flex-col gap-6", className.value)} {...domProps(props.value)}>
        <Card tape="corner" seed="reset-password-01-done">
          <CardHeader class="justify-items-center text-center">
            <Seal variant="rosette" mark="check" tone="grass" size={104} label="Done" tilt={-4} />
            <CardTitle ref={titleRef} tabindex={-1} role="heading" aria-level={1} class="text-[2rem] outline-none">
              Password changed
            </CardTitle>
            <CardDescription>
              You can sign in with it now.{onSubmit.value ? null : " (This is a demo: nothing was saved.)" as const}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild class="w-full">
              <a href="#login">Back to sign in</a>
            </Button>
          </CardContent>
        </Card>
      </div>;
    }
    return <div class={cn("flex flex-col gap-6", className.value)} {...domProps(props.value)}>
      <Card tape="corner" seed="reset-password-01">
        <CardHeader class="justify-items-center text-center">
          <Mascot pose="write" size={80} />
          <CardTitle role="heading" aria-level={1} class="text-[2rem]">
            Choose a new password
          </CardTitle>
          <CardDescription>Make it one you will remember. Nobody is watching the pen.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit.value} novalidate>
            <FieldGroup>
              {formError.value ? <Alert variant="destructive">
                  <Icon name="circle-alert" />
                  <AlertTitle>That did not go through</AlertTitle>
                  <AlertDescription>{formError.value}</AlertDescription>
                </Alert> : null}
              <Field data-invalid={!!errors.value.password}>
                <FieldLabel for={id.value("password")}>New password</FieldLabel>
                <PasswordInput id={id.value("password")} autocomplete="new-password" required aria-invalid={!!errors.value.password} aria-describedby={describedBy(id.value("rules"), !!errors.value.password && id.value("password-error"))} {...domProps(register.value("password", {
                  onChange: () => {
                    if (getValues.value("confirm")) void trigger.value("confirm");
                  }
                }))} />
                <ul id={id.value("rules")} aria-label="A good password has" class="grid gap-1 text-sm">
                  {RULES.map(rule => {
                    const met = rule.test(password.value);
                    return <li key={rule.key} data-met={met} class={cn("flex items-center gap-2", met ? "text-green" as const : "text-muted-foreground" as const)}>
                        <Icon name={met ? "circle-check" as const : "circle" as const} size={16} />
                        <span class="sr-only">{met ? "Done: " as const : "Not yet: " as const}</span>
                        {rule.label}
                      </li>;
                  })}
                </ul>
                <FieldError id={id.value("password-error")} errors={[errors.value.password]} />
              </Field>
              <Field data-invalid={!!errors.value.confirm}>
                <FieldLabel for={id.value("confirm")}>Confirm new password</FieldLabel>
                <PasswordInput id={id.value("confirm")} toggleLabel="Show password confirmation" autocomplete="new-password" required aria-invalid={!!errors.value.confirm} aria-describedby={errors.value.confirm ? id.value("confirm-error") : undefined} {...domProps(register.value("confirm"))} />
                <FieldError id={id.value("confirm-error")} errors={[errors.value.confirm]} />
              </Field>
              <Field>
                <Button type="submit" aria-busy={isSubmitting.value} disabled={isSubmitting.value}>
                  {isSubmitting.value ? <>
                      <Spinner aria-hidden="true" /> Saving
                    </> : "Save new password" as const}
                </Button>
                <FieldDescription class="text-center">
                  Changed your mind? <a href="#login">Back to sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>;
  };
});
export { ResetPasswordForm };
export type { ResetPasswordFormProps, ResetPasswordValues };
