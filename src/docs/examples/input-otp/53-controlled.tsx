// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
export const meta = {
  title: "Controlled" as const,
  description: "shadcn's `input-otp-controlled`: `value` and `onChange` hold the code in your state, and a line under the boxes echoes it back. The line is a live region, so it is read out as you type." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const value = shallowRef(initialState(""));
  const setValue = stateSetter(value);
  return () => {
    return <div class="space-y-2">
      <InputOTP maxlength={6} value={value.value} onChange={value => setValue(value)} aria-label="One-time password">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div class="text-center text-sm" role="status">
        {value.value === "" ? <>Enter your one-time password.</> : <>You entered: {value.value}</>}
      </div>
    </div>;
  };
});
export default Example;
