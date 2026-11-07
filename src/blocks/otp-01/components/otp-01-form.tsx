// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, REGEXP_ONLY_DIGITS } from "@/components/ui/input-otp";
import { Mascot } from "@/components/ui/mascot";
import { Seal } from "@/components/ui/seal";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
const DEMO_CODE = "246810";
type Status = "idle" | "verifying" | "wrong" | "verified";
type OtpFormProps = Omit<UI.ComponentProps<"div">, "onSubmit"> & {
  email?: string;
  onVerify?: (code: string) => boolean | Promise<boolean>;
  onResend?: () => void | Promise<void>;
  onContinue?: () => void;
  resendAfter?: number;
};
const demoVerify = (code: string) => new Promise<boolean>(resolve => setTimeout(() => resolve(code === DEMO_CODE), 600));
const OtpForm = defineUi<OtpFormProps>("OtpForm", ["class", "email", "onVerify", "onResend", "onContinue", "resendAfter"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const email = computed(() => _props["email"] === undefined ? "ada@notes.dev" as const : _props["email"]);
  const onVerify = computed(() => _props["onVerify"]);
  const onResend = computed(() => _props["onResend"]);
  const onContinue = computed(() => _props["onContinue"]);
  const resendAfter = computed(() => _props["resendAfter"] === undefined ? 30 : _props["resendAfter"]);
  const props = computed(() => omitProps(_props, ["class", "email", "onVerify", "onResend", "onContinue", "resendAfter"]));
  const uid = useId();
  const id = computed(() => (name: string) => `${uid}-${name}`);
  const inputRef = shallowRef<HTMLInputElement | null>(null);
  const titleRef = shallowRef<HTMLDivElement | null>(null);
  const busy = shallowRef(false);
  const code = shallowRef(initialState(""));
  const setCode = stateSetter(code);
  const status = shallowRef<Status>(initialState("idle"));
  const setStatus = stateSetter(status);
  const message = shallowRef(initialState("That code is not right. Check the latest email and try again."));
  const setMessage = stateSetter(message);
  const left = shallowRef(initialState(resendAfter.value));
  const setLeft = stateSetter(left);
  const resent = shallowRef(initialState(false));
  const setResent = stateSetter(resent);
  watchDependencies(() => {
    if (left.value <= 0) return;
    const timer = setTimeout(() => setLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, () => [left.value], false);
  watchDependencies(() => {
    if (status.value === "wrong") inputRef.value?.focus();
    if (status.value === "verified") titleRef.value?.focus();
  }, () => [status.value], false);
  return () => {
    async function verify(value: string) {
      if (busy.value || value.length < 6) return;
      busy.value = true;
      setStatus("verifying");
      try {
        const ok = await (onVerify.value ?? demoVerify)(value);
        if (ok) setStatus("verified");else {
          setMessage("That code is not right. Check the latest email and try again.");
          setCode("");
          setStatus("wrong");
        }
      } catch {
        setMessage("We could not check that code. Try again in a moment.");
        setCode("");
        setStatus("wrong");
      } finally {
        busy.value = false;
      }
    }
    async function resend() {
      setResent(true);
      setCode("");
      setStatus("idle");
      setLeft(resendAfter.value);
      inputRef.value?.focus();
      try {
        await onResend.value?.();
      } catch {
        setResent(false);
      }
    }
    if (status.value === "verified") {
      return <div class={cn("flex flex-col gap-6", className.value)} {...domProps(props.value)}>
        <Card tape="corner" seed="otp-01-done">
          <CardHeader class="justify-items-center text-center">
            <Seal variant="rosette" mark="check" tone="grass" size={104} label="Verified" tilt={-4} />
            <CardTitle ref={titleRef} tabindex={-1} role="heading" aria-level={1} class="text-[2rem] outline-none">
              You are verified
            </CardTitle>
            <CardDescription>{email.value} is confirmed. Welcome to the desk.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" class="w-full" onClick={onContinue.value}>
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>;
    }
    const verifying = status.value === "verifying";
    return <div class={cn("flex flex-col gap-6", className.value)} {...domProps(props.value)}>
      <Card tape="corner" seed="otp-01">
        <CardHeader class="justify-items-center text-center">
          <Mascot pose={status.value === "wrong" ? "oops" as const : verifying ? "search" as const : "think" as const} size={80} />
          <CardTitle role="heading" aria-level={1} class="text-[2rem]">
            Check your email
          </CardTitle>
          <CardDescription>
            We sent a six-digit code to <strong class="font-bold text-foreground">{email.value}</strong>. It works for ten minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form novalidate onSubmit={(event: SubmitEvent) => {
            event.preventDefault();
            void verify(code.value);
          }}>
            <FieldGroup>
              <Field data-invalid={status.value === "wrong"} class="items-center">
                <FieldLabel for={id.value("code")} class="sr-only">
                  Verification code
                </FieldLabel>
                <InputOTP id={id.value("code")} ref={inputRef} maxlength={6} pattern={REGEXP_ONLY_DIGITS} inputmode="numeric" value={code.value} disabled={verifying} invalid={status.value === "wrong"} aria-describedby={status.value === "wrong" ? id.value("code-error") : id.value("code-hint")} containerClassName="w-full justify-center" onChange={value => {
                  setCode(value);
                  if (status.value === "wrong") setStatus("idle");
                }} onComplete={value => void verify(value)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {status.value === "wrong" ? <FieldError id={id.value("code-error")} class="text-center">
                    {message.value}
                  </FieldError> : <FieldDescription id={id.value("code-hint")} class="text-center">
                    Type it, or paste it whole.
                  </FieldDescription>}
              </Field>
              <Field>
                <Button type="submit" aria-busy={verifying} disabled={verifying || code.value.length < 6}>
                  {verifying ? <>
                      <Spinner aria-hidden="true" /> Checking
                    </> : "Verify" as const}
                </Button>
                <FieldDescription class="text-center">
                  {left.value > 0 ? <span role="timer">Need another? You can ask again in {left.value}s.</span> : <>
                      Did not get it?{" "}
                      <button type="button" onClick={() => void resend()} class="text-link underline underline-offset-4 hover:text-link-hover">
                        Resend code
                      </button>
                    </>}
                </FieldDescription>
                <p role="status" class="sr-only">
                  {resent.value && left.value > 0 ? "A new code is on its way." as const : "" as const}
                </p>
                <FieldDescription class="text-center">
                  Wrong address? <a href="#change-email">Change your email</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>;
  };
});
export { OtpForm, DEMO_CODE };
export type { OtpFormProps };
