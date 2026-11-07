// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Underline } from "@/components/ui/underline";
export const meta = {
  title: "Default" as const,
  description: "A felt-tip line under a phrase. It rises a little to the right, starts a hair early and runs past the last letter." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <p class="max-w-md text-[17px] leading-[1.55]">
      Underline the parts you will need again, like <Underline>the date of the meeting</Underline>, and leave the rest for the next pass.
    </p>;
  };
});
export default Example;
