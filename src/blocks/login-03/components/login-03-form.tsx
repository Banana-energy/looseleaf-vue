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
import { BrandMark } from "@/blocks/login-03/components/login-03-brand-marks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Highlight } from "@/components/ui/highlight";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
const schema = z.object({
  email: z.email("Enter a full address, like ada@notes.dev."),
  password: z.string().min(1, "Enter your password.")
});
type LoginValues = z.infer<typeof schema>;
type LoginFormProps = Omit<UI.ComponentProps<"div">, "onSubmit"> & {
  onSubmit?: (values: LoginValues) => void | Promise<void>;
};
const pretend = () => new Promise<void>(resolve => setTimeout(resolve, 700));
const PasswordInput = defineUi<Omit<UI.ComponentProps<typeof InputGroupInput>, "type">>("PasswordInput", [], (_props, {
  slots: _slots
}) => {
  const props = computed(() => omitProps(_props, []));
  const shown = shallowRef(initialState(false));
  const setShown = stateSetter(shown);
  return () => {
    return <InputGroup>
      <InputGroupInput type={shown.value ? "text" as const : "password" as const} {...domProps(props.value)}>{_slots.default?.()}</InputGroupInput>
      <InputGroupAddon align="inline-end" class="has-[>button]:-me-1">
        <InputGroupButton size="icon-sm" class="size-7 compact:size-6 calm:size-6" aria-label="Show password" aria-pressed={shown.value} onClick={() => setShown(v => !v)}>
          <Icon name={shown.value ? "eye-off" as const : "eye" as const} size={16} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>;
  };
});
const LoginForm = defineUi<LoginFormProps>("LoginForm", ["class", "onSubmit"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const onSubmit = computed(() => _props["onSubmit"]);
  const props = computed(() => omitProps(_props, ["class", "onSubmit"]));
  const uid = useId();
  const id = computed(() => (name: string) => `${uid}-${name}`);
  const formError = shallowRef<string | null>(initialState(null));
  const setFormError = stateSetter(formError);
  const signedIn = shallowRef(initialState(false));
  const setSignedIn = stateSetter(signedIn);
  const _hook9 = useForm<LoginValues>(() => ({
    resolver: zodResolver(schema),
    mode: "onTouched" as const,
    defaultValues: {
      email: "" as const,
      password: "" as const
    }
  }));
  const register = computed(() => _hook9.value.register);
  const handleSubmit = computed(() => _hook9.value.handleSubmit);
  const errors = computed(() => _hook9.value.formState.errors);
  const isSubmitting = computed(() => _hook9.value.formState.isSubmitting);
  const submit = computed(() => handleSubmit.value(async values => {
    setFormError(null);
    try {
      await (onSubmit.value ?? pretend)(values);
      if (!onSubmit.value) setSignedIn(true);
    } catch (error) {
      setFormError(error instanceof Error && error.message ? error.message : "Something went wrong on our side. Try again in a moment." as const);
    }
  }));
  return () => {
    return <div class={cn("flex flex-col gap-6", className.value)} {...domProps(props.value)}>
      <Card seed="login-03">
        <CardHeader class="text-center">
          <CardTitle role="heading" aria-level={1} class="text-[2rem]">
            Welcome <Highlight class="ms-1">back</Highlight>
          </CardTitle>
          <CardDescription>Sign in with Apple or Google, or with your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit.value} novalidate>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button">
                  <BrandMark name="apple" />
                  Sign in with Apple
                </Button>
                <Button variant="outline" type="button">
                  <BrandMark name="google" />
                  Sign in with Google
                </Button>
              </Field>
              <FieldSeparator>Or continue with</FieldSeparator>
              {formError.value ? <Alert variant="destructive">
                  <Icon name="circle-alert" />
                  <AlertTitle>We could not sign you in</AlertTitle>
                  <AlertDescription>{formError.value}</AlertDescription>
                </Alert> : null}
              {signedIn.value ? <Alert variant="success" role="status">
                  <Icon name="circle-check" />
                  <AlertTitle>You are in (this is a demo)</AlertTitle>
                  <AlertDescription>Nothing was sent anywhere. Pass an onSubmit to LoginForm to sign in for real.</AlertDescription>
                </Alert> : null}
              <Field data-invalid={!!errors.value.email}>
                <FieldLabel for={id.value("email")}>Email</FieldLabel>
                <Input id={id.value("email")} type="email" autocomplete="email" placeholder="ada@notes.dev" required aria-invalid={!!errors.value.email} aria-describedby={errors.value.email ? id.value("email-error") : undefined} {...domProps(register.value("email"))} />
                <FieldError id={id.value("email-error")} errors={[errors.value.email]} />
              </Field>
              <Field data-invalid={!!errors.value.password}>
                <div class="flex items-center gap-3">
                  <FieldLabel for={id.value("password")}>Password</FieldLabel>
                  <a href="#forgot-password" class="-my-1 ms-auto py-1 text-sm text-link underline underline-offset-4 hover:text-link-hover">
                    Forgot your password?
                  </a>
                </div>
                <PasswordInput id={id.value("password")} autocomplete="current-password" required aria-invalid={!!errors.value.password} aria-describedby={errors.value.password ? id.value("password-error") : undefined} {...domProps(register.value("password"))} />
                <FieldError id={id.value("password-error")} errors={[errors.value.password]} />
              </Field>
              <Field>
                <Button type="submit" aria-busy={isSubmitting.value} disabled={isSubmitting.value}>
                  {isSubmitting.value ? <>
                      <Spinner aria-hidden="true" /> Signing in
                    </> : "Sign in" as const}
                </Button>
                <FieldDescription class="text-center">
                  New here? <a href="#signup">Make an account</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription class="px-6 text-center text-balance [&>a]:whitespace-nowrap [&>a]:text-foreground [&>a:hover]:text-foreground">
        By continuing you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
      </FieldDescription>
    </div>;
  };
});
export { LoginForm };
export type { LoginFormProps, LoginValues };
