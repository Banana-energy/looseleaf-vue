// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "With button" as const,
  description: "Official `textarea-with-button`: the field stacked over a full-width Send button on a two-row grid. The gap is `gap-3` (the original's `gap-2` plus a pencil's width): a marker band bleeds a few pixels past its box, and a wide one would touch the field." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-sm gap-3">
      <Textarea placeholder="Type your message here." aria-label="Message" />
      <Button>Send message</Button>
    </div>;
  };
});
export default Example;
