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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Mascot } from "@/components/ui/mascot";
import { Spinner } from "@/components/ui/spinner";
import { Sticker } from "@/components/ui/sticker";
import { cn } from "@/lib/utils";
const schema = z.object({
  email: z.email("Enter a full address, like ada@notes.dev.")
});
type ForgotPasswordValues = z.infer<typeof schema>;
type ForgotPasswordFormProps = Omit<UI.ComponentProps<"div">, "onSubmit"> & {
  onSubmit?: (values: ForgotPasswordValues) => void | Promise<void>;
};
const pretend = () => new Promise<void>(resolve => setTimeout(resolve, 700));
const ForgotPasswordForm = defineUi<ForgotPasswordFormProps>("ForgotPasswordForm", ["class", "onSubmit"], (_props, {
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
  const sentTo = shallowRef<string | null>(initialState(null));
  const setSentTo = stateSetter(sentTo);
  const again = shallowRef(initialState(false));
  const setAgain = stateSetter(again);
  const resending = shallowRef(initialState(false));
  const setResending = stateSetter(resending);
  const _hook14 = useForm<ForgotPasswordValues>(() => ({
    resolver: zodResolver(schema),
    mode: "onTouched" as const,
    defaultValues: {
      email: "" as const
    }
  }));
  const register = computed(() => _hook14.value.register);
  const handleSubmit = computed(() => _hook14.value.handleSubmit);
  const errors = computed(() => _hook14.value.formState.errors);
  const isSubmitting = computed(() => _hook14.value.formState.isSubmitting);
  watchDependencies(() => {
    if (sentTo.value) titleRef.value?.focus();
  }, () => [sentTo.value], false);
  const submit = computed(() => handleSubmit.value(values => send(values.email)));
  return () => {
    async function send(email: string) {
      setFormError(null);
      try {
        await (onSubmit.value ?? pretend)({
          email
        });
        setSentTo(email);
        return true;
      } catch (error) {
        setFormError(error instanceof Error && error.message ? error.message : "We could not send that link. Try again in a moment." as const);
        return false;
      }
    }
    if (sentTo.value) {
      return <div class={cn("flex flex-col gap-6", className.value)} {...domProps(props.value)}>
        <Card tape="corner" seed="forgot-password-01-sent">
          <CardHeader class="justify-items-center text-center">
            <Sticker name="envelope-heart" size={96} rotate={-6} />
            <CardTitle ref={titleRef} tabindex={-1} role="heading" aria-level={1} class="text-[2rem] outline-none">
              Check your email
            </CardTitle>
            <CardDescription>
              If <strong class="font-bold text-foreground">{sentTo.value}</strong> has an account, a link to choose a new password is on its way. It works for one hour.
              {onSubmit.value ? null : " (This is a demo: nothing was sent.)" as const}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {formError.value ? <Alert variant="destructive">
                  <Icon name="circle-alert" />
                  <AlertTitle>That did not go through</AlertTitle>
                  <AlertDescription>{formError.value}</AlertDescription>
                </Alert> : null}
              <Field>
                <Button asChild>
                  <a href="#login">Back to sign in</a>
                </Button>
                <FieldDescription class="text-center">
                  Nothing yet? Look in your spam folder, or{" "}
                  <button type="button" aria-disabled={resending.value} onClick={async () => {
                    if (resending.value) return;
                    setResending(true);
                    setAgain(false);
                    setAgain(await send(sentTo.value));
                    setResending(false);
                  }} class="text-link underline underline-offset-4 hover:text-link-hover aria-disabled:text-pencil-text">
                    send it again
                  </button>
                  .
                </FieldDescription>
                <p role="status" class="sr-only">
                  {again.value ? "We sent the link again." as const : "" as const}
                </p>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>;
    }
    return <div class={cn("flex flex-col gap-6", className.value)} {...domProps(props.value)}>
      <Card tape="corner" seed="forgot-password-01">
        <CardHeader class="justify-items-center text-center">
          <Mascot pose="search" size={80} />
          <CardTitle role="heading" aria-level={1} class="text-[2rem]">
            Forgot your password?
          </CardTitle>
          <CardDescription>No harm done. Tell us your email and we will send a link to choose a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit.value} novalidate>
            <FieldGroup>
              {formError.value ? <Alert variant="destructive">
                  <Icon name="circle-alert" />
                  <AlertTitle>That did not go through</AlertTitle>
                  <AlertDescription>{formError.value}</AlertDescription>
                </Alert> : null}
              <Field data-invalid={!!errors.value.email}>
                <FieldLabel for={id.value("email")}>Email</FieldLabel>
                <Input id={id.value("email")} type="email" autocomplete="email" placeholder="ada@notes.dev" required aria-invalid={!!errors.value.email} aria-describedby={errors.value.email ? id.value("email-error") : undefined} {...domProps(register.value("email"))} />
                <FieldError id={id.value("email-error")} errors={[errors.value.email]} />
              </Field>
              <Field>
                <Button type="submit" aria-busy={isSubmitting.value} disabled={isSubmitting.value}>
                  {isSubmitting.value ? <>
                      <Spinner aria-hidden="true" /> Sending
                    </> : "Send reset link" as const}
                </Button>
                <FieldDescription class="text-center">
                  Remembered it? <a href="#login">Back to sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>;
  };
});
export { ForgotPasswordForm };
export type { ForgotPasswordFormProps, ForgotPasswordValues };
