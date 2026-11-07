// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Verify your email" as const,
  description: "The whole flow: the last digit completes the code (onComplete), which checks it; a wrong one turns the boxes red and offers a fresh start; 246810 is the right code. Resend is a link-style Button." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 420
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const value = shallowRef(initialState(""));
  const setValue = stateSetter(value);
  const state = shallowRef<"idle" | "wrong" | "done">(initialState("idle"));
  const setState = stateSetter(state);
  return () => {
    return <Card seed="verify" tape="corner" class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>We sent a six-digit code to ada@analytical.engine.</CardDescription>
      </CardHeader>
      <CardContent class="grid justify-items-center gap-3 py-4">
        <Label for="verify-code" class="sr-only">
          Verification code
        </Label>
        <InputOTP id="verify-code" maxlength={6} value={value.value} disabled={state.value === "done"} invalid={state.value === "wrong"} aria-describedby="verify-msg" onChange={v => {
          setValue(v);
          if (state.value === "wrong") setState("idle");
        }} onComplete={code => setState(code === "246810" ? "done" as const : "wrong" as const)}>
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
        <p id="verify-msg" role={state.value === "wrong" ? "alert" as const : "status" as const} class={state.value === "wrong" ? "font-hand text-sm text-red" as const : "font-hand text-sm text-ink-muted" as const}>
          {state.value === "done" ? "Verified. Welcome to the notebook." as const : state.value === "wrong" ? "That is not the code. Check the email and try again." as const : "It expires in ten minutes." as const}
        </p>
      </CardContent>
      <CardFooter class="justify-between gap-3 border-t">
        <Button variant="link" size="sm" onClick={() => {
          setValue("");
          setState("idle");
        }}>
          {state.value === "wrong" ? "Start over" as const : "Send it again" as const}
        </Button>
        <Button disabled={value.value.length < 6 || state.value === "done"} onClick={() => setState(value.value === "246810" ? "done" as const : "wrong" as const)}>
          Verify
        </Button>
      </CardFooter>
    </Card>;
  };
});
export default Example;
