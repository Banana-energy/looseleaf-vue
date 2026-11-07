// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "A sign-up form" as const,
  description: "Real validation: the email field turns red with its message the moment it is wrong, and the form only submits when it is right." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const email = shallowRef(initialState(""));
  const setEmail = stateSetter(email);
  const touched = shallowRef(initialState(false));
  const setTouched = stateSetter(touched);
  const done = shallowRef(initialState(false));
  const setDone = stateSetter(done);
  const invalid = computed(() => touched.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value));
  return () => {
    return <form class="grid w-full max-w-sm gap-5" onSubmit={(e: SubmitEvent) => {
      e.preventDefault();
      setTouched(true);
      if (!invalid.value && email.value) setDone(true);
    }} novalidate>
      <div class="grid gap-2">
        <Label for="su-name" required>
          Your name
        </Label>
        <Input id="su-name" name="name" autocomplete="name" required placeholder="Ada Lovelace" />
      </div>
      <div class="grid gap-2">
        <Label for="su-email" required>
          Email
        </Label>
        <Input id="su-email" name="email" type="email" autocomplete="email" required value={email.value} onChange={(e: Event) => setEmail((e.target as HTMLInputElement).value)} onBlur={() => setTouched(true)} aria-invalid={invalid.value} aria-describedby="su-email-error" placeholder="you@example.com" />
        <p id="su-email-error" class="min-h-5 text-sm text-red">
          {invalid.value ? "That does not look like an email address." as const : "" as const}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="su-terms" name="terms" required />
        <Label for="su-terms">I have read the small print</Label>
      </div>
      <Button type="submit" class="w-full">{done.value ? "Signed up, thanks" as const : "Sign up" as const}</Button>
    </form>;
  };
});
export default Example;
