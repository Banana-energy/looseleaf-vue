// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "Demo" as const,
  description: "Official `textarea-demo`: a bare textarea with a placeholder. It sits in a hand-drawn box that grows with its text (`field-sizing: content`, as upstream) and redraws the resize grip in its corner. Only addition: an `aria-label`, since there is no visible label." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Textarea placeholder="Type your message here." aria-label="Message" class="max-w-sm" />;
  };
});
export default Example;
