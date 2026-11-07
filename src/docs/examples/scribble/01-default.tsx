// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Scribble } from "@/components/ui/scribble";
export const meta = {
  title: "Default" as const,
  description: "A word scribbled out in ink. The strokes lean, vary in pitch and spill past the letters." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <p class="max-w-md text-[17px] leading-[1.55]">
      Dear <Scribble>Mr. Whitcombe</Scribble> Sam, thank you for the tomatoes; they were <Scribble weight="fine">acceptable</Scribble> wonderful.
    </p>;
  };
});
export default Example;
