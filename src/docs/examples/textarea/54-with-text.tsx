// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "With text" as const,
  description: "Official `textarea-with-text`: a label, the field and a line of help text below. The help is linked to the field with `aria-describedby` (the original leaves it unlinked), so a screen reader reads it with the field." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-sm gap-3">
      <Label for="textarea-with-text-message">Your Message</Label>
      <Textarea placeholder="Type your message here." id="textarea-with-text-message" aria-describedby="textarea-with-text-help" />
      <p id="textarea-with-text-help" class="text-sm text-muted-foreground">
        Your message will be copied to the support team.
      </p>
    </div>;
  };
});
export default Example;
