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
import { Highlight } from "@/components/ui/highlight";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Tally } from "@/components/ui/tally";
import { cn } from "@/lib/utils";
const schema = z.object({
  name: z.string().trim().min(2, "Tell us what to call you (at least 2 letters)."),
  email: z.email("Enter a full address, like ada@notes.dev."),
  password: z.string().min(8, "Use at least 8 characters.").regex(/\d/, "Add at least one number."),
  confirm: z.string().min(1, "Type the password once more.")
}).refine(v => v.password === v.confirm, {
  path: ["confirm"],
  message: "Those two do not match yet." as const
});
type SignupFormValues = z.infer<typeof schema>;
type SignupValues = Pick<SignupFormValues, "name" | "email" | "password">;
type SignupFormProps = Omit<UI.ComponentProps<"div">, "onSubmit"> & {
  onSubmit?: (values: SignupValues) => void | Promise<void>;
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
const STRENGTH = ["", "weak", "okay", "good", "strong"] as const;
function scoreOf(password: string) {
  const points = [password.length >= 8, /\d/.test(password), /[a-z]/.test(password) && /[A-Z]/.test(password), password.length >= 12].filter(Boolean).length;
  return Math.max(1, points);
}
const SignupForm = defineUi<SignupFormProps>("SignupForm", ["class", "onSubmit"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const onSubmit = computed(() => _props["onSubmit"]);
  const props = computed(() => omitProps(_props, ["class", "onSubmit"]));
  const uid = useId();
  const id = computed(() => (name: string) => `${uid}-${name}`);
  const formError = shallowRef<string | null>(initialState(null));
  const setFormError = stateSetter(formError);
  const created = shallowRef(initialState(false));
  const setCreated = stateSetter(created);
  const _hook9 = useForm<SignupFormValues>(() => ({
    resolver: zodResolver(schema),
    mode: "onTouched" as const,
    defaultValues: {
      name: "" as const,
      email: "" as const,
      password: "" as const,
      confirm: "" as const
    }
  }));
  const register = computed(() => _hook9.value.register);
  const handleSubmit = computed(() => _hook9.value.handleSubmit);
  const getValues = computed(() => _hook9.value.getValues);
  const trigger = computed(() => _hook9.value.trigger);
  const watch = computed(() => _hook9.value.watch);
  const errors = computed(() => _hook9.value.formState.errors);
  const isSubmitting = computed(() => _hook9.value.formState.isSubmitting);
  const submit = computed(() => handleSubmit.value(async ({
    name,
    email,
    password
  }) => {
    setFormError(null);
    try {
      await (onSubmit.value ?? pretend)({
        name,
        email,
        password
      });
      if (!onSubmit.value) setCreated(true);
    } catch (error) {
      setFormError(error instanceof Error && error.message ? error.message : "Something went wrong on our side. Try again in a moment." as const);
    }
  }));
  const password = computed(() => watch.value("password"));
  const score = computed(() => scoreOf(password.value));
  return () => {
    return <div class={cn("@container/signup flex flex-col gap-6", className.value)} {...domProps(props.value)}>
      <Card seed="signup-03">
        <CardHeader class="text-center">
          <CardTitle role="heading" aria-level={1} class="text-[2rem]">
            Create your <Highlight class="ms-1">account</Highlight>
          </CardTitle>
          <CardDescription>Four lines and you are in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit.value} novalidate class="@container/pw">
            <FieldGroup>
              {formError.value ? <Alert variant="destructive">
                  <Icon name="circle-alert" />
                  <AlertTitle>We could not create your account</AlertTitle>
                  <AlertDescription>{formError.value}</AlertDescription>
                </Alert> : null}
              {created.value ? <Alert variant="success" role="status">
                  <Icon name="circle-check" />
                  <AlertTitle>Account created (this is a demo)</AlertTitle>
                  <AlertDescription>Nothing was sent anywhere. Pass an onSubmit to SignupForm to create accounts for real.</AlertDescription>
                </Alert> : null}
              <Field data-invalid={!!errors.value.name}>
                <FieldLabel for={id.value("name")}>Full name</FieldLabel>
                <Input id={id.value("name")} autocomplete="name" placeholder="Ada Lovelace" required aria-invalid={!!errors.value.name} aria-describedby={errors.value.name ? id.value("name-error") : undefined} {...domProps(register.value("name"))} />
                <FieldError id={id.value("name-error")} errors={[errors.value.name]} />
              </Field>
              <Field data-invalid={!!errors.value.email}>
                <FieldLabel for={id.value("email")}>Email</FieldLabel>
                <Input id={id.value("email")} type="email" autocomplete="email" placeholder="ada@notes.dev" required aria-invalid={!!errors.value.email} aria-describedby={describedBy(id.value("email-hint"), !!errors.value.email && id.value("email-error"))} {...domProps(register.value("email"))} />
                <FieldDescription id={id.value("email-hint")}>We use this to reach you and never share it.</FieldDescription>
                <FieldError id={id.value("email-error")} errors={[errors.value.email]} />
              </Field>
              <Field>
                <div class="grid gap-4 @[20rem]/pw:grid-cols-2">
                  <Field data-invalid={!!errors.value.password}>
                    <FieldLabel for={id.value("password")}>Password</FieldLabel>
                    <PasswordInput id={id.value("password")} autocomplete="new-password" required aria-invalid={!!errors.value.password} aria-describedby={describedBy(id.value("password-hint"), !!errors.value.password && id.value("password-error"))} {...domProps(register.value("password", {
                      onChange: () => {
                        if (getValues.value("confirm")) void trigger.value("confirm");
                      }
                    }))} />
                    <FieldError id={id.value("password-error")} errors={[errors.value.password]} />
                  </Field>
                  <Field data-invalid={!!errors.value.confirm}>
                    <FieldLabel for={id.value("confirm")}>Confirm password</FieldLabel>
                    <PasswordInput id={id.value("confirm")} toggleLabel="Show password confirmation" autocomplete="new-password" required aria-invalid={!!errors.value.confirm} aria-describedby={describedBy(id.value("password-hint"), !!errors.value.confirm && id.value("confirm-error"))} {...domProps(register.value("confirm"))} />
                    <FieldError id={id.value("confirm-error")} errors={[errors.value.confirm]} />
                  </Field>
                </div>
                <FieldDescription id={id.value("password-hint")}>At least 8 characters and one number.</FieldDescription>
                <div aria-live="polite" class="text-sm empty:-mt-3">
                  {password.value ? <span class="flex items-center gap-2">
                      <span class="text-muted-foreground">Strength</span>
                      <Tally count={score.value} size="sm" tone={score.value > 2 ? "green" as const : "ink" as const} label={`Password strength: ${STRENGTH[score.value]}`} />
                      <span class="font-bold">{STRENGTH[score.value]}</span>
                    </span> : null}
                </div>
              </Field>
              <Field>
                <Button type="submit" aria-busy={isSubmitting.value} disabled={isSubmitting.value}>
                  {isSubmitting.value ? <>
                      <Spinner aria-hidden="true" /> Creating account
                    </> : "Create account" as const}
                </Button>
                <FieldDescription class="text-center">
                  Already have an account? <a href="#login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription class="px-6 text-center text-balance [&>a]:whitespace-nowrap [&>a]:text-foreground [&>a:hover]:text-foreground">
        By creating an account you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
      </FieldDescription>
    </div>;
  };
});
export { SignupForm };
export type { SignupFormProps, SignupValues };
