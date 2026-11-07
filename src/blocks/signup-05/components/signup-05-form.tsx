// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { zodResolver } from "@/lib/schema-bridge";
import { useForm } from "@/lib/form-bridge";
import { z } from "zod";
import { BrandMark } from "@/blocks/signup-05/components/signup-05-brand-marks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Circled } from "@/components/ui/circled";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Mascot } from "@/components/ui/mascot";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
const schema = z.object({
  email: z.email("Enter a full address, like ada@notes.dev.")
});
type SignupValues = z.infer<typeof schema>;
type SignupFormProps = Omit<UI.ComponentProps<"div">, "onSubmit"> & {
  onSubmit?: (values: SignupValues) => void | Promise<void>;
};
const pretend = () => new Promise<void>(resolve => setTimeout(resolve, 700));
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
  const sentTo = shallowRef<string | null>(initialState(null));
  const setSentTo = stateSetter(sentTo);
  const _hook9 = useForm<SignupValues>(() => ({
    resolver: zodResolver(schema),
    mode: "onTouched" as const,
    defaultValues: {
      email: "" as const
    }
  }));
  const register = computed(() => _hook9.value.register);
  const handleSubmit = computed(() => _hook9.value.handleSubmit);
  const reset = computed(() => _hook9.value.reset);
  const setFocus = computed(() => _hook9.value.setFocus);
  const errors = computed(() => _hook9.value.formState.errors);
  const isSubmitting = computed(() => _hook9.value.formState.isSubmitting);
  const sentRef = shallowRef<HTMLDivElement | null>(null);
  watchDependencies(() => {
    if (sentTo.value) sentRef.value?.focus();
  }, () => [sentTo.value], false);
  const refocus = shallowRef(false);
  watchDependencies(() => {
    if (sentTo.value === null && refocus.value) {
      refocus.value = false;
      setFocus.value("email");
    }
  }, () => [sentTo.value, setFocus.value], false);
  const submit = computed(() => handleSubmit.value(async values => {
    setFormError(null);
    try {
      await (onSubmit.value ?? pretend)(values);
      setSentTo(values.email);
    } catch (error) {
      setFormError(error instanceof Error && error.message ? error.message : "We could not send that link. Try again in a moment." as const);
    }
  }));
  return () => {
    return <div class={cn("@container/signup flex flex-col gap-6", className.value)} {...domProps(props.value)}>
      <form onSubmit={submit.value} novalidate>
        <FieldGroup>
          <div class="flex flex-col items-center gap-2 text-center">
            <Mascot pose={sentTo.value ? "celebrate" as const : "think" as const} size={88} />
            <h1 class="my-3 font-script text-[2.25rem] leading-none font-bold">
              Pull up a <Circled tone="marker" class="mx-2">chair</Circled>
            </h1>
            <FieldDescription>
              Already have an account? <a href="#login">Sign in</a>
            </FieldDescription>
          </div>
          {formError.value ? <Alert variant="destructive">
              <Icon name="circle-alert" />
              <AlertTitle>That did not go through</AlertTitle>
              <AlertDescription>{formError.value}</AlertDescription>
            </Alert> : null}
          {sentTo.value ? <>
              <Alert ref={sentRef} tabindex={-1} variant="success" role="status" class="outline-none">
                <Icon name="mail-check" />
                <AlertTitle>Check your inbox</AlertTitle>
                <AlertDescription>
                  A link is on its way to {sentTo.value}. Open it on this device to finish.
                  {onSubmit.value ? null : " (This is a demo: nothing was sent.)" as const}
                </AlertDescription>
              </Alert>
              <Field>
                <Button type="button" variant="outline" onClick={() => {
                refocus.value = true;
                setSentTo(null);
                reset.value({
                  email: sentTo.value
                });
              }}>
                  Use a different email
                </Button>
              </Field>
            </> : <>
              <Field data-invalid={!!errors.value.email}>
                <FieldLabel for={id.value("email")}>Email</FieldLabel>
                <Input id={id.value("email")} type="email" autocomplete="email" placeholder="ada@notes.dev" required aria-invalid={!!errors.value.email} aria-describedby={errors.value.email ? id.value("email-error") : undefined} {...domProps(register.value("email"))} />
                <FieldError id={id.value("email-error")} errors={[errors.value.email]} />
              </Field>
              <Field>
                <Button type="submit" aria-busy={isSubmitting.value} disabled={isSubmitting.value}>
                  {isSubmitting.value ? <>
                      <Spinner aria-hidden="true" /> Sending
                    </> : "Email me a link to start" as const}
                </Button>
              </Field>
            </>}
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field class="grid gap-4 @sm/signup:grid-cols-2">
            <Button variant="outline" type="button" aria-label="Continue with Apple">
              <BrandMark name="apple" />
              Apple
            </Button>
            <Button variant="outline" type="button" aria-label="Continue with Google">
              <BrandMark name="google" />
              Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription class="px-6 text-center text-balance [&>a]:whitespace-nowrap">
        By continuing you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
      </FieldDescription>
    </div>;
  };
});
export { SignupForm };
export type { SignupFormProps, SignupValues };
