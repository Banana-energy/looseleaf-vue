// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { InputOTP, InputOTPGroup, InputOTPSlot, REGEXP_ONLY_DIGITS_AND_CHARS } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Letters and digits, a wrong code" as const,
  description: "pattern lets letters in (anything else is refused, also when pasted). The right code here is AB12; the box starts on AB13, so you can see what a wrong code looks like: red boxes and a message you write. Change the last character to 2 and it clears." as const,
  layout: "center" as const,
  height: 240
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const value = shallowRef(initialState("AB13"));
  const setValue = stateSetter(value);
  const wrong = computed(() => value.value.length === 4 && value.value.toUpperCase() !== "AB12");
  return () => {
    return <div class="grid gap-3">
      <Label for="otp-code">Invite code</Label>
      <InputOTP id="otp-code" maxlength={4} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} inputmode="text" value={value.value} onChange={v => setValue(v.toUpperCase())} invalid={wrong.value} aria-describedby="otp-code-msg">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <p id="otp-code-msg" role={wrong.value ? "alert" as const : undefined} class={wrong.value ? "font-hand text-sm text-red" as const : "font-hand text-sm text-ink-muted" as const}>
        {wrong.value ? "That code does not match. Try again." as const : value.value.toUpperCase() === "AB12" ? "That is the one." as const : "Four letters or digits." as const}
      </p>
    </div>;
  };
});
export default Example;
