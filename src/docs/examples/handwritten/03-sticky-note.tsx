// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Handwritten } from "@/components/ui/handwritten";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "A sticky note" as const,
  description: "Handwritten inside a sticky note: the sheet turns a little, the words only jitter." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="sticky-yellow" tilt seed="sticky" curl class="w-56 p-5">
      <Handwritten as="p" class="font-script text-[26px] leading-[1.15]">
        call mum before six, and bring the good umbrella!
      </Handwritten>
    </Paper>;
  };
});
export default Example;
