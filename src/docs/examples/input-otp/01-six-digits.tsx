// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Six digits" as const,
  description: "Click and type, or paste \"482915\" (three digits are already in). The box with the caret wears the blue ring and a blinking pencil stroke; each digit writes itself in; the dash is only decoration." as const,
  layout: "center" as const,
  height: 220
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const value = shallowRef(initialState("482"));
  const setValue = stateSetter(value);
  return () => {
    return <div class="grid gap-3">
      <Label for="otp-six">One-time code</Label>
      <InputOTP id="otp-six" maxlength={6} value={value.value} onChange={setValue}>
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
      <p class="font-hand text-sm text-ink-muted" aria-live="polite">
        {value.value === "" ? "Enter your one-time password." as const : `You entered: ${value.value}`}
      </p>
    </div>;
  };
});
export default Example;
