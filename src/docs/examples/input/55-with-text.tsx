// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "With help text" as const,
  description: "shadcn's `input-with-text`: a line of muted help under the field. Here it is joined to the input with `aria-describedby`, which the original leaves to you." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-sm items-center gap-3">
      <Label for="input-text-email">Email</Label>
      <Input type="email" id="input-text-email" placeholder="Email" aria-describedby="input-text-email-help" />
      <p id="input-text-email-help" class="text-sm text-muted-foreground">
        Enter your email address.
      </p>
    </div>;
  };
});
export default Example;
